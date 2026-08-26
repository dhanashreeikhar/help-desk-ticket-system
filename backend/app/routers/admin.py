from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..database import get_db
from ..models import Ticket, User
from ..schemas import (
    TicketResponse,
    TicketStatusUpdate,
    TicketAssign
)
from ..dependencies import require_admin


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get(
    "/tickets",
    response_model=list[TicketResponse]
)
def get_all_tickets(
    search: str = None,
    status: str = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    query = db.query(Ticket)

    if search:
        query = query.join(
            User,
            Ticket.creator_id == User.id
        ).filter(
            or_(
                Ticket.title.ilike(f"%{search}%"),
                User.username.ilike(f"%{search}%")
            )
        )

    if status:
        query = query.filter(
            Ticket.status == status
        )

    return query.all()


# ADD THE NEW CODE HERE
@router.get("/support-users")
def get_support_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    users = db.query(User).filter(
        User.role == "support"
    ).all()

    return [
        {
            "id": user.id,
            "username": user.username
        }
        for user in users
    ]


@router.get(
    "/tickets/{ticket_id}",
    response_model=TicketResponse
)
def admin_get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return ticket


@router.patch(
    "/tickets/{ticket_id}/status",
    response_model=TicketResponse
)
def change_status(
    ticket_id: int,
    status_data: TicketStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    allowed_transitions = {
        "Open": ["In Progress"],
        "In Progress": ["Closed"],
        "Closed": []
    }

    if status_data.status not in [
        "Open",
        "In Progress",
        "Closed"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    if status_data.status not in allowed_transitions[
        ticket.status
    ]:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Cannot change status from "
                f"{ticket.status} to {status_data.status}"
            )
        )

    ticket.status = status_data.status

    db.commit()
    db.refresh(ticket)

    return ticket


@router.patch(
    "/tickets/{ticket_id}/assign",
    response_model=TicketResponse
)
def assign_ticket(
    ticket_id: int,
    assignment: TicketAssign,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    support_user = db.query(User).filter(
        User.id == assignment.assigned_to,
        User.role == "support"
    ).first()

    if not support_user:
        raise HTTPException(
            status_code=400,
            detail="Support user not found"
        )

    ticket.assigned_to = support_user.id

    db.commit()
    db.refresh(ticket)

    return ticket


@router.delete(
    "/tickets/{ticket_id}"
)
def admin_delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    db.delete(ticket)
    db.commit()

    return {
        "message": "Ticket deleted successfully"
    }


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    total = db.query(Ticket).count()

    open_count = db.query(Ticket).filter(
        Ticket.status == "Open"
    ).count()

    in_progress = db.query(Ticket).filter(
        Ticket.status == "In Progress"
    ).count()

    closed = db.query(Ticket).filter(
        Ticket.status == "Closed"
    ).count()

    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress,
        "closed": closed
    }