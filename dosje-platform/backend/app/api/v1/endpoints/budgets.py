from typing import List
from decimal import Decimal
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.db.session import get_db
from app.models.budget import BudgetAllocation, Expenditure
from app.models.project import Project
from app.schemas.budget import (
    BudgetAllocationCreate,
    BudgetAllocationResponse,
    ExpenditureCreate,
    ExpenditureUpdateStatus,
    ExpenditureResponse,
)
from app.core.exceptions import NotFoundException, BadRequestException, PermissionDeniedException
from app.core.permissions import UserRole
from app.api.deps import get_current_user, require_roles
from app.models.user import User

router = APIRouter()


@router.get("/projects/{project_id}/budgets", response_model=List[BudgetAllocationResponse])
def get_project_budgets(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all budget allocations sanctioned for a project facility."""
    stmt = select(BudgetAllocation).where(BudgetAllocation.project_id == project_id)
    allocations = db.scalars(stmt).all()
    return allocations


@router.post("/projects/{project_id}/budgets", response_model=BudgetAllocationResponse, status_code=status.HTTP_201_CREATED)
def create_project_budget(
    project_id: str,
    budget_in: BudgetAllocationCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY)),
    db: Session = Depends(get_db),
):
    """Sanction a new budget allocation for a project facility."""
    project = db.scalar(select(Project).where(Project.id == project_id))
    if not project:
        raise NotFoundException("Project", project_id)

    if budget_in.sanctioned_amount <= Decimal("0.00"):
        raise BadRequestException("Sanctioned budget amount must be strictly greater than zero.")

    new_budget = BudgetAllocation(
        project_id=project_id,
        fiscal_year=budget_in.fiscal_year,
        sanctioned_amount=budget_in.sanctioned_amount,
        released_amount=budget_in.released_amount,
        allocation_date=budget_in.allocation_date,
        approved_by_id=current_user.id,
        status="SANCTIONED",
        notes=budget_in.notes,
    )
    db.add(new_budget)

    # Automatically increment project sanctioned grant
    project.sanctioned_grant_lakhs += (budget_in.sanctioned_amount / Decimal("100000"))
    db.commit()
    db.refresh(new_budget)
    return new_budget


@router.get("/projects/{project_id}/expenditures", response_model=List[ExpenditureResponse])
def get_project_expenditures(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve line-item expenditure claims for a project."""
    stmt = select(Expenditure).where(Expenditure.project_id == project_id)
    expenditures = db.scalars(stmt).all()
    return [
        ExpenditureResponse(
            id=e.id,
            project_id=e.project_id,
            amount=float(e.amount),
            category=e.category,
            description=e.description,
            invoice_reference=e.invoice_reference,
            submitted_by_id=e.submitted_by_id,
            reviewed_by_id=e.reviewed_by_id,
            approval_status=e.approval_status,
            rejection_reason=e.rejection_reason,
            created_at=e.created_at,
            updated_at=e.updated_at,
        )
        for e in expenditures
    ]


@router.post("/projects/{project_id}/expenditures", response_model=ExpenditureResponse, status_code=status.HTTP_201_CREATED)
def submit_expenditure_claim(
    project_id: str,
    exp_in: ExpenditureCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY, UserRole.NGO)),
    db: Session = Depends(get_db),
):
    """Submit an expenditure claim with supporting documentation reference."""
    project = db.scalar(select(Project).where(Project.id == project_id))
    if not project:
        raise NotFoundException("Project", project_id)

    if exp_in.amount <= Decimal("0.00"):
        raise BadRequestException("Expenditure claim must be positive.")

    # Validate against total sanctioned grant
    project_sanctioned_rupees = project.sanctioned_grant_lakhs * Decimal("100000")
    project_utilized_rupees = project.utilized_grant_lakhs * Decimal("100000")
    if (project_utilized_rupees + exp_in.amount) > project_sanctioned_rupees:
        raise BadRequestException(
            f"Expenditure of ₹{exp_in.amount:,.2f} exceeds remaining sanctioned allocation of ₹{(project_sanctioned_rupees - project_utilized_rupees):,.2f}."
        )

    new_exp = Expenditure(
        project_id=project_id,
        amount=exp_in.amount,
        category=exp_in.category,
        description=exp_in.description,
        invoice_reference=exp_in.invoice_reference,
        submitted_by_id=current_user.id,
        approval_status="SUBMITTED",
    )
    db.add(new_exp)
    db.commit()
    db.refresh(new_exp)

    return ExpenditureResponse(
        id=new_exp.id,
        project_id=new_exp.project_id,
        amount=float(new_exp.amount),
        category=new_exp.category,
        description=new_exp.description,
        invoice_reference=new_exp.invoice_reference,
        submitted_by_id=new_exp.submitted_by_id,
        reviewed_by_id=new_exp.reviewed_by_id,
        approval_status=new_exp.approval_status,
        rejection_reason=new_exp.rejection_reason,
        created_at=new_exp.created_at,
        updated_at=new_exp.updated_at,
    )


@router.patch("/expenditures/{expenditure_id}/status", response_model=ExpenditureResponse)
def update_expenditure_approval_status(
    expenditure_id: str,
    status_in: ExpenditureUpdateStatus,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY)),
    db: Session = Depends(get_db),
):
    """Approve or reject a submitted expenditure claim. Restricted to Central or State Authority."""
    exp = db.scalar(select(Expenditure).where(Expenditure.id == expenditure_id))
    if not exp:
        raise NotFoundException("Expenditure", expenditure_id)

    old_status = exp.approval_status
    exp.approval_status = status_in.approval_status
    exp.reviewed_by_id = current_user.id
    exp.rejection_reason = status_in.rejection_reason

    # If transitioning to APPROVED, increment the project's utilized grant
    if status_in.approval_status == "APPROVED" and old_status != "APPROVED":
        project = db.scalar(select(Project).where(Project.id == exp.project_id))
        if project:
            project.utilized_grant_lakhs += (exp.amount / Decimal("100000"))

    db.commit()
    db.refresh(exp)

    return ExpenditureResponse(
        id=exp.id,
        project_id=exp.project_id,
        amount=float(exp.amount),
        category=exp.category,
        description=exp.description,
        invoice_reference=exp.invoice_reference,
        submitted_by_id=exp.submitted_by_id,
        reviewed_by_id=exp.reviewed_by_id,
        approval_status=exp.approval_status,
        rejection_reason=exp.rejection_reason,
        created_at=exp.created_at,
        updated_at=exp.updated_at,
    )
