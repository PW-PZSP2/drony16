from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, distinct
from models import User, OperatorService, Order
from utils import calculate_distance
from typing import List


async def find_matched_operators(
    db: AsyncSession, order: Order, required_services: List[str]
) -> List[User]:
    find_operators = (
        select(User)
        .join(OperatorService, User.user_id == OperatorService.operator_id)
        .filter(
            User.role == "ope",
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
