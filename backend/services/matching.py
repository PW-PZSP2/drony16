from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, distinct, cast, Text
from models import User, OperatorService, Order, MatchedOrder
from utils import calculate_distance
from typing import List
from models import OrderService, OrderParameter
from sqlalchemy.orm import selectinload


async def find_matched_operators(
    db: AsyncSession, order: Order, required_services: List[int]
) -> List[User]:
    find_operators = (
        select(User)
        .join(OperatorService, User.user_id == OperatorService.operator_id)
        .filter(
            cast(User.role, Text) == "ope",
            User.is_blocked == "N",
            User.latitude.isnot(None),
            User.longitude.isnot(None),
            OperatorService.service_id.in_(required_services),
        )
        .group_by(User.user_id)
        .having(func.count(distinct(User.user_id)) == len(required_services))
    )
    if order.latitude is None or order.longitude is None:
        return []

    result = await db.execute(find_operators)
    candidate_operators = result.scalars().all()

    matched_operators = []
    for operator in candidate_operators:
        if operator.latitude is None or operator.longitude is None:
            continue
        distance = calculate_distance(
            order.latitude,
            order.longitude,
            operator.latitude,
            operator.longitude,
        )
        if operator.area and distance <= operator.area:
            matched_operators.append(operator)
    return matched_operators


async def save_matched_order(db: AsyncSession, order: Order, operator: User):
    matched_order = MatchedOrder(order_id=order.order_id, operator_id=operator.user_id)
    db.add(matched_order)
    await db.commit()


async def get_matched_orders_for_operator(
    db: AsyncSession, operator_id: int
) -> List[Order]:
    matched_orders = (
        select(Order)
        .join(MatchedOrder, Order.order_id == MatchedOrder.order_id)
        .where(MatchedOrder.operator_id == operator_id)
        .options(
            selectinload(Order.order_services).selectinload(OrderService.service),
            selectinload(Order.order_parameters).selectinload(OrderParameter.parameter),
        )
    )
    result = await db.execute(matched_orders)
    return list(result.scalars().all())
