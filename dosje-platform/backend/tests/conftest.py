import sys
import os
import pytest
from decimal import Decimal
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.core.security import hash_password
from app.models.user import User
from app.models.organization import Organization
from app.models.scheme import Scheme
from app.models.project import Project

# In-memory SQLite database specifically for test isolation
TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    # Seed baseline fixtures
    pwd = hash_password("Demo@123")
    admin_user = User(
        id="test-admin-1",
        email="admin@test.gov",
        hashed_password=pwd,
        name="Test Central Admin",
        role="admin",
        designation="Joint Secretary",
        department="DoSJE",
        is_active=True,
    )
    authority_user = User(
        id="test-auth-1",
        email="authority.mh@test.gov",
        hashed_password=pwd,
        name="Test Maharashtra Authority",
        role="authority",
        designation="Director",
        department="Social Welfare Maharashtra",
        state="Maharashtra",
        is_active=True,
    )
    ngo_user = User(
        id="test-ngo-1",
        email="ngo@test.org",
        hashed_password=pwd,
        name="Test NGO Lead",
        role="ngo",
        organization_id="test-org-1",
        is_active=True,
    )

    test_scheme = Scheme(
        id="test-scheme-1",
        code="PM-AJAY-TEST",
        name="Test PM-AJAY Scheme",
        category="SC Welfare",
        target_group="SC Households",
        budget_allocated_cr=Decimal("100.00"),
        status="ACTIVE",
    )
    test_org = Organization(
        id="test-org-1",
        darpan_id="MH/TEST/001",
        name="Test Welfare Organization",
        state="Maharashtra",
        district="Pune",
        registration_number="REG-TEST-001",
        contact_person="Test Lead",
        email="lead@test.org",
        phone="+91 99999 88888",
    )
    test_project = Project(
        id="test-proj-1",
        project_code="TEST-PROJ-001",
        name="Test Livelihood Center",
        scheme_id="test-scheme-1",
        ngo_id="test-org-1",
        state="Maharashtra",
        district="Pune",
        address="Test Industrial Area, Pune",
        sanctioned_grant_lakhs=Decimal("50.00"),
        status="ACTIVE",
    )

    session.add_all([admin_user, authority_user, ngo_user, test_scheme, test_org, test_project])
    session.commit()

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
