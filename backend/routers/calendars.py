from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from database import get_db
from models import Order, User
from auth import get_current_user
from typing import List
from schemas import CalendarOrderResponse

router = APIRouter(
    prefix="/calendars",
    tags=["calendars"],
    responses={404: {"description": "Not found"}},
)


@router.get("/orders", response_model=List[CalendarOrderResponse])
async def get_calendar_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get orders for the calendar based on user role:
    - If user is a client (cli): returns orders where client_id matches the user
    - If user is an operator (ope): returns orders where client_id OR operator_id matches the user
    """

    if current_user.role == "cli":
        # Client sees only their own orders
        query = select(Order).where(Order.client_id == current_user.user_id).options(
            selectinload(Order.order_services)
        )
    elif current_user.role == "ope":
        # Operator sees orders where they are either the client or the operator
        query = select(Order).where(
            or_(
                Order.client_id == current_user.user_id,
                Order.operator_id == current_user.user_id
            )
        ).options(
            selectinload(Order.order_services)
        )
    else:
        # Admin doesn't have access to calendar
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins do not have access to calendar"
        )

    result = await db.execute(query)
    orders = result.scalars().all()

    # Transform orders to calendar response format
    orders_response = []
    for order in orders:
        # Get the first service_id for this order
        service_id = None
        if hasattr(order, 'order_services') and order.order_services:
            service_id = order.order_services[0].service_id

        orders_response.append(CalendarOrderResponse(
            order_id=order.order_id,
            deadline=order.deadline,
            name=order.name,
            status=order.state,
            service_id=service_id
        ))

    return orders_response
