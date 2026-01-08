from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime, date
from typing import cast
from database import get_db
from models import (
    Order,
    OrderService,
    OrderParameter,
    User,
    Service,
    ServiceParameter,
    ReportedOperator,
)
from schemas import (
    OrderCreate,
    OrderResponse,
    ServiceRequest,
    OpinionCreate,
    OpinionResponse,
    UserResponse,
)
from auth import get_current_user
from utils import get_coordinates
from services.matching import (
    get_matched_orders_for_operator,
)


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

    order_service_ids = []
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

        order_service_ids.append(service_obj.service_id)

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

    response_services = order_data.services

    return OrderResponse(
        order_id=int(new_order.order_id),
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
        status=new_order.state,
    )


@router.get("/matched", response_model=list[OrderResponse])
async def get_matched_orders(
    from_date: datetime | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "ope":
        raise HTTPException(status_code=403, detail="Unauthorized")
    matched_orders = await get_matched_orders_for_operator(
        db, current_user.user_id, from_date
    )

    response = []
    for order in matched_orders:
        services_data = []
        for os in order.order_services:
            params = {}
            for op in order.order_parameters:
                if op.parameter.service_id == os.service_id:
                    params[op.parameter.name] = op.value

            services_data.append(
                ServiceRequest(service_name=os.service.name, parameters=params)
            )

        response.append(
            OrderResponse(
                order_id=order.order_id,
                name=order.name,
                deadline=datetime.combine(order.deadline, datetime.min.time()),
                location=order.location,
                latitude=order.latitude,
                longitude=order.longitude,
                description=order.description or "",
                completion_date=str(order.completion_date) == "1",
                raid_date=str(order.raid_date) == "1",
                client_id=order.client_id,
                operator_id=order.operator_id,
                creation_date=datetime.combine(
                    order.creation_date, datetime.min.time()
                ),
                services=services_data,
                status=order.state,
            )
        )

    return response


@router.get("/client/pending", response_model=list[OrderResponse])
async def get_pending_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "cli":
        raise HTTPException(status_code=403, detail="Unauthorized")

    query = (
        select(Order)
        .where(Order.client_id == current_user.user_id)
        .where(Order.operator_id.is_(None))
        .options(
            selectinload(Order.order_services).selectinload(OrderService.service),
            selectinload(Order.order_parameters).selectinload(OrderParameter.parameter),
            selectinload(Order.reported_entries),
        )
    )
    result = await db.execute(query)
    orders = result.scalars().all()

    response = []
    for order in orders:
        services_data = []
        for os in order.order_services:
            params = {}
            for op in order.order_parameters:
                if op.parameter.service_id == os.service_id:
                    params[op.parameter.name] = op.value

            services_data.append(
                ServiceRequest(service_name=os.service.name, parameters=params)
            )

        interested_ops = [report.operator_id for report in order.reported_entries]

        response.append(
            OrderResponse(
                order_id=order.order_id,
                name=order.name,
                deadline=datetime.combine(order.deadline, datetime.min.time()),
                location=order.location,
                latitude=order.latitude,
                longitude=order.longitude,
                description=order.description or "",
                completion_date=str(order.completion_date) == "1",
                raid_date=str(order.raid_date) == "1",
                client_id=order.client_id,
                operator_id=order.operator_id,
                creation_date=datetime.combine(
                    order.creation_date, datetime.min.time()
                ),
                services=services_data,
                interested_operators=interested_ops,
                status=order.state,
            )
        )

    return response


@router.get("/client/history", response_model=list[OrderResponse])
async def get_client_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "cli":
        raise HTTPException(status_code=403, detail="Unauthorized")

    query = (
        select(Order)
        .where(Order.client_id == current_user.user_id)
        .where(Order.operator_id.is_not(None))
        .options(
            selectinload(Order.order_services).selectinload(OrderService.service),
            selectinload(Order.order_parameters).selectinload(OrderParameter.parameter),
            selectinload(Order.reported_entries),
        )
    )
    result = await db.execute(query)
    orders = result.scalars().all()

    response = []
    for order in orders:
        services_data = []
        for os in order.order_services:
            params = {}
            for op in order.order_parameters:
                if op.parameter.service_id == os.service_id:
                    params[op.parameter.name] = op.value

            services_data.append(
                ServiceRequest(service_name=os.service.name, parameters=params)
            )

        response.append(
            OrderResponse(
                order_id=order.order_id,
                name=order.name,
                deadline=datetime.combine(order.deadline, datetime.min.time()),
                location=order.location,
                latitude=order.latitude,
                longitude=order.longitude,
                description=order.description or "",
                completion_date=str(order.completion_date) == "1",
                raid_date=str(order.raid_date) == "1",
                client_id=order.client_id,
                operator_id=order.operator_id,
                creation_date=datetime.combine(
                    order.creation_date, datetime.min.time()
                ),
                services=services_data,
                status=order.state,
            )
        )

    return response


@router.get("/{order_id}/candidates", response_model=list[UserResponse])
async def get_order_candidates(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "cli":
        raise HTTPException(status_code=403, detail="Unauthorized")

    result = await db.execute(
        select(Order)
        .where(Order.order_id == order_id)
        .where(Order.client_id == current_user.user_id)
    )
    order = result.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    query = (
        select(User)
        .join(ReportedOperator, User.user_id == ReportedOperator.operator_id)
        .where(ReportedOperator.order_id == order_id)
    )
    result = await db.execute(query)
    candidates = result.scalars().all()

    return candidates


@router.get("/assigned", response_model=list[OrderResponse])
async def get_assigned_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "ope":
        raise HTTPException(status_code=403, detail="Unauthorized")

    query = (
        select(Order)
        .where(Order.operator_id == current_user.user_id)
        .options(
            selectinload(Order.order_services).selectinload(OrderService.service),
            selectinload(Order.order_parameters).selectinload(OrderParameter.parameter),
            selectinload(Order.reported_entries),
        )
    )
    result = await db.execute(query)
    orders = result.scalars().all()

    response = []
    for order in orders:
        services_data = []
        for os in order.order_services:
            params = {}
            for op in order.order_parameters:
                if op.parameter.service_id == os.service_id:
                    params[op.parameter.name] = op.value

            services_data.append(
                ServiceRequest(service_name=os.service.name, parameters=params)
            )

        interested_ops = [report.operator_id for report in order.reported_entries]

        response.append(
            OrderResponse(
                order_id=order.order_id,
                name=order.name,
                deadline=datetime.combine(order.deadline, datetime.min.time()),
                location=order.location,
                latitude=order.latitude,
                longitude=order.longitude,
                description=order.description or "",
                completion_date=str(order.completion_date) == "1",
                raid_date=str(order.raid_date) == "1",
                client_id=order.client_id,
                operator_id=order.operator_id,
                creation_date=datetime.combine(
                    order.creation_date, datetime.min.time()
                ),
                services=services_data,
                interested_operators=interested_ops,
                status=order.state,
            )
        )

    return response


@router.post("/{order_id}/interest")
async def register_interest(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "ope":
        raise HTTPException(status_code=403, detail="Unauthorized")

    result = await db.execute(select(Order).filter(Order.order_id == order_id))
    order = result.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    result = await db.execute(
        select(ReportedOperator)
        .filter(ReportedOperator.order_id == order_id)
        .filter(ReportedOperator.operator_id == current_user.user_id)
    )
    existing_interest = result.scalars().first()
    if existing_interest:
        raise HTTPException(status_code=400, detail="Interest already registered")

    new_interest = ReportedOperator(
        date=datetime.now(),
        order_id=order_id,
        operator_id=current_user.user_id,
    )
    db.add(new_interest)
    await db.commit()

    return {"message": "Interest registered successfully"}


@router.post("/{order_id}/select/{operator_id}")
async def select_operator(
    order_id: int,
    operator_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Order)
        .filter(Order.order_id == order_id)
        .filter(Order.client_id == current_user.user_id)
    )
    order = result.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or unauthorized")

    result = await db.execute(
        select(ReportedOperator)
        .filter(ReportedOperator.order_id == order_id)
        .filter(ReportedOperator.operator_id == operator_id)
    )
    interest = result.scalars().first()
    if not interest:
        raise HTTPException(
            status_code=400, detail="Operator has not registered interest in this order"
        )

    order.operator_id = operator_id
    order.operator_selection_date = datetime.now()
    order.state = "W trakcie"

    await db.commit()

    return {"message": "Operator selected successfully"}


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        select(Order)
        .where(Order.order_id == order_id)
        .options(
            selectinload(Order.order_services).selectinload(OrderService.service),
            selectinload(Order.order_parameters).selectinload(OrderParameter.parameter),
            selectinload(Order.reported_entries),
        )
    )
    result = await db.execute(query)
    order = result.scalars().first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    services_data = []
    for os in order.order_services:
        params = {}
        for op in order.order_parameters:
            if op.parameter.service_id == os.service_id:
                params[op.parameter.name] = op.value

        services_data.append(
            ServiceRequest(service_name=os.service.name, parameters=params)
        )

    interested_ops = []
    if order.client_id == current_user.user_id:
        interested_ops = [report.operator_id for report in order.reported_entries]

    return OrderResponse(
        order_id=order.order_id,
        name=order.name,
        deadline=datetime.combine(order.deadline, datetime.min.time()),
        location=order.location,
        latitude=order.latitude,
        longitude=order.longitude,
        description=order.description or "",
        completion_date=str(order.completion_date) == "1",
        raid_date=str(order.raid_date) == "1",
        client_id=order.client_id,
        operator_id=order.operator_id,
        creation_date=datetime.combine(order.creation_date, datetime.min.time()),
        services=services_data,
        interested_operators=interested_ops,
        status=order.state,
    )


@router.post("/{order_id}/opinion", response_model=OpinionResponse)
async def post_opinion(
    order_id: int,
    opinion_data: OpinionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Order).filter(Order.order_id == order_id))
    order_obj = result.scalars().first()
    if not order_obj:
        raise HTTPException(status_code=404, detail="Order not found")

    if order_obj.client_id != current_user.user_id:
        raise HTTPException(
            status_code=403,
            detail="Only the client who created the order can post an opinion",
        )

    if opinion_data.score < 1 or opinion_data.score > 5:
        raise HTTPException(status_code=400, detail="Score must be between 1 and 5")

    if order_obj.score is not None:
        raise HTTPException(
            status_code=400, detail="Opinion already set for this order"
        )

    order_obj.score = opinion_data.score
    order_obj.opinion = opinion_data.opinion

    await db.commit()
    await db.refresh(order_obj)

    return OpinionResponse(
        order_id=int(order_obj.order_id),
        score=int(order_obj.score),
        opinion=str(order_obj.opinion),
    )
