from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, date
from typing import cast
from database import get_db
from models import Order, OrderService, OrderParameter, User, Service, ServiceParameter
from schemas import OrderCreate, OrderResponse
from auth import get_current_user
from utils import get_coordinates


router = APIRouter(
    prefix="/orders",
    tags=["orders"],
    responses={404: {"description": "Not found"}},
)


@router.post("", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_order = Order(
        name=order_data.name,
        creation_date=datetime.now(),
        description=order_data.description,
        raid_date="1" if order_data.raid_date else "0",
        completion_date="1" if order_data.raid_date is False else "0",
        deadline=order_data.deadline,
        location=order_data.location,
        client_id=current_user.user_id,
        operator_id=None,
        state="Złożone",
    )

    location = get_coordinates(order_data.location)
    if location:
        new_order.latitude = location[0]
        new_order.longitude = location[1]
    else:
        raise HTTPException(status_code=400, detail="Location not found")

    db.add(new_order)
    await db.flush()

    for service_req in order_data.services:
        result = await db.execute(
            select(Service).filter(Service.name == service_req.service_name)
        )
        service_obj = result.scalars().first()

        if not service_obj:
            raise HTTPException(
                status_code=400,
                detail=f"Service '{service_req.service_name}' not found",
            )

        new_order_service = OrderService(
            order_id=new_order.order_id, service_id=service_obj.service_id
        )
        db.add(new_order_service)

        for param_name, param_value in service_req.parameters.items():
            param_result = await db.execute(
                select(ServiceParameter)
                .filter(ServiceParameter.service_id == service_obj.service_id)
                .filter(ServiceParameter.name == param_name)
            )
            param_obj = param_result.scalars().first()

            if not param_obj:
                raise HTTPException(
                    status_code=400,
                    detail=f"Parameter '{param_name}' not found for service '{service_req.service_name}'",
                )

            new_order_param = OrderParameter(
                order_id=new_order.order_id,
                parameter_id=param_obj.parameter_id,
                value=str(param_value),
            )
            db.add(new_order_param)

    await db.commit()
    await db.refresh(new_order)

    # matched_operators = await find_matched_operators(
    #     db, new_order, [service.service_id for service in order_data.services]
    # )

    response_services = order_data.services

    return OrderResponse(
        id=int(new_order.order_id),
        name=str(new_order.name),
        completion_date=str(new_order.completion_date) == "1",
        raid_date=str(new_order.raid_date) == "1",
        deadline=datetime.combine(cast(date, new_order.deadline), datetime.min.time()),
        location=str(new_order.location),
        latitude=new_order.latitude,
        longitude=new_order.longitude,
        description=str(new_order.description) if new_order.description else "",
        services=response_services,
        client_id=int(new_order.client_id),
        operator_id=int(new_order.operator_id) if new_order.operator_id else None,
        creation_date=datetime.combine(
            cast(date, new_order.creation_date), datetime.min.time()
        ),
    )
