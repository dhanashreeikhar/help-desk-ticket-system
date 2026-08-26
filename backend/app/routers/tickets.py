from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Ticket, User
from ..schemas import (
    TicketCreate,
    TicketUpdate,
    TicketResponse
)
from ..dependencies import get_current_user


router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"]
)


@router.post(
    "",
    response_model=TicketResponse
)
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = Ticket(
        title=ticket_data.title,
        description=ticket_data.description,
        status="Open",
        creator_id=current_user.id
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket


@router.get(
    "/my",
    response_model=list[TicketResponse]
)
def get_my_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tickets = db.query(Ticket).filter(
        Ticket.creator_id == current_user.id
    ).all()

    return tickets


@router.get(
    "/{ticket_id}",
    response_model=TicketResponse
)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    if (
        current_user.role != "admin"
        and ticket.creator_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You cannot access this ticket"
        )

    return ticket


@router.put(
    "/{ticket_id}",
    response_model=TicketResponse
)
def update_ticket(
    ticket_id: int,
    ticket_data: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    if ticket.creator_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own tickets"
        )

    if ticket.status != "Open":
        raise HTTPException(
            status_code=400,
            detail="Only Open tickets can be updated"
        )

    if ticket_data.title is not None:
        ticket.title = ticket_data.title

    if ticket_data.description is not None:
        ticket.description = ticket_data.description

    db.commit()
    db.refresh(ticket)

    return ticket


@router.delete(
    "/{ticket_id}"
)
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    if ticket.creator_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own tickets"
        )

    if ticket.status != "Open":
        raise HTTPException(
            status_code=400,
            detail="Only Open tickets can be deleted"
        )

    db.delete(ticket)
    db.commit()

    return {
        "message": "Ticket deleted successfully"
    }