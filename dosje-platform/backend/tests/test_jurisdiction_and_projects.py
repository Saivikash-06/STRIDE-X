def test_jurisdiction_access_control(client, db_session):
    from decimal import Decimal
    from app.models.project import Project

    # Create project in Uttar Pradesh
    up_project = Project(
        id="test-proj-up",
        project_code="UP-VAR-001",
        name="Varanasi Center",
        scheme_id="test-scheme-1",
        ngo_id="test-org-1",
        state="Uttar Pradesh",
        district="Varanasi",
        address="Varanasi, UP",
        sanctioned_grant_lakhs=Decimal("40.00"),
        status="ACTIVE",
    )
    db_session.add(up_project)
    db_session.commit()

    # 1. State Authority of Maharashtra attempts to access UP project
    mh_login = client.post(
        "/api/v1/auth/login",
        json={"email": "authority.mh@test.gov", "password": "Demo@123"},
    )
    mh_token = mh_login.json()["access_token"]

    mh_access_res = client.get(
        "/api/v1/projects/test-proj-up",
        headers={"Authorization": f"Bearer {mh_token}"},
    )
    assert mh_access_res.status_code == 403

    # 2. Central Admin accesses UP project without restriction
    admin_login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.gov", "password": "Demo@123"},
    )
    admin_token = admin_login.json()["access_token"]

    admin_access_res = client.get(
        "/api/v1/projects/test-proj-up",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert admin_access_res.status_code == 200
    assert admin_access_res.json()["name"] == "Varanasi Center"
