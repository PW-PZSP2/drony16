from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import User, Order
from utils import calculate_distance
from typing import List
from datetime import datetime
from models import OrderService, OrderParameter
from sqlalchemy.orm import selectinload


async def get_matched_orders_for_operator(
    db: AsyncSession, operator_id: int, from_date: datetime | None = None
) -> List[Order]:
    stmt_operator = (
        select(User)
        .options(selectinload(User.services_provided))
        .where(User.user_id == operator_id)
    )
    result_operator = await db.execute(stmt_operator)
    operator = result_operator.scalars().first()

    if not operator:
        return []

    operator_service_ids = {os.service_id for os in operator.services_provided}

    stmt_orders = (
        select(Order)
        .where(Order.operator_id.is_(None))
        .options(
            selectinload(Order.order_services).selectinload(OrderService.service),
            selectinload(Order.order_parameters).selectinload(OrderParameter.parameter),
            selectinload(Order.reported_entries),
        )
    )

    if from_date:
        stmt_orders = stmt_orders.where(Order.creation_date >= from_date)

    result_orders = await db.execute(stmt_orders)
    candidate_orders = result_orders.scalars().all()

    matched_orders = []
    for order in candidate_orders:
        order_required_services = {os.service_id for os in order.order_services}
        if not order_required_services.issubset(operator_service_ids):
            continue

        if (
            order.latitude is not None
            and order.longitude is not None
            and operator.latitude is not None
            and operator.longitude is not None
        ):
            distance = calculate_distance(
                order.latitude, order.longitude, operator.latitude, operator.longitude
            )
            if operator.area and distance <= operator.area:
                matched_orders.append(order)

    return matched_orders
