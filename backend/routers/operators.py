from fastapi import APIRouter, Depends, HTTPException, Body, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from database import get_db
from models import Order, User, OperatorService, Service, Attachment
from auth import get_current_user
from utils import get_coordinates

router = APIRouter(
    prefix="/operators",
    tags=["operators"],
    responses={404: {"description": "Not found"}},
)


@router.get("/average/{operator_id}")
async def get_operator_average(
    operator_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(func.avg(Order.score)).filter(
            Order.operator_id == operator_id, Order.score.isnot(None)
        )
    )
    avg_value = result.scalar()
    if avg_value is None:
        return {"operator_id": operator_id, "average_score": None}
    return {"operator_id": operator_id, "average_score": float(avg_value)}


@router.patch("/me/location")
async def update_my_location(
    localisation: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "ope":
        raise HTTPException(status_code=403, detail="Unauthorized")

    current_user.localisation = localisation

    coords = get_coordinates(localisation)
    if coords:
        current_user.latitude = float(coords[0])
        current_user.longitude = float(coords[1])
    else:
        current_user.latitude = None
        current_user.longitude = None

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return {
        "user_id": current_user.user_id,
        "localisation": current_user.localisation,
        "latitude": current_user.latitude,
        "longitude": current_user.longitude,
    }


@router.patch("/me/area")
async def update_my_area(
    area: int = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "ope":
        raise HTTPException(status_code=403, detail="Unauthorized")

    current_user.area = area
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return {"user_id": current_user.user_id, "area": current_user.area}


@router.put("/me/services")
async def update_my_services(
    services: list = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "ope":
        raise HTTPException(status_code=403, detail="Unauthorized")

    if not isinstance(services, list):
        raise HTTPException(
            status_code=400, detail="services must be a list of ids, names, or objects"
        )

    resolved_ids: list[int] = []
    missing_names: list[str] = []
    for item in services:
        if isinstance(item, int):
            resolved_ids.append(item)
        elif isinstance(item, str):
            result = await db.execute(select(Service).filter(Service.name == item))
            s = result.scalars().first()
            if not s:
                missing_names.append(item)
            else:
                resolved_ids.append(s.service_id)
        elif isinstance(item, dict):
            if "id" in item:
                try:
                    resolved_ids.append(int(item["id"]))
                except Exception:
                    raise HTTPException(
                        status_code=400, detail="Invalid id in service object"
                    )
            elif "name" in item:
                result = await db.execute(
                    select(Service).filter(Service.name == item["name"])
                )
                s = result.scalars().first()
                if not s:
                    missing_names.append(item["name"])
                else:
                    resolved_ids.append(s.service_id)
            else:
                raise HTTPException(
                    status_code=400, detail="Service object must contain 'id' or 'name'"
                )
        else:
            raise HTTPException(
                status_code=400, detail="Service items must be int, str or object"
            )

    if missing_names:
        raise HTTPException(
            status_code=400, detail=f"Services not found by name: {missing_names}"
        )

    resolved_ids = list(dict.fromkeys(resolved_ids))

    if len(resolved_ids) == 0:
        await db.execute(
            delete(OperatorService).where(
                OperatorService.operator_id == current_user.user_id
            )
        )
        await db.commit()
        return {"user_id": current_user.user_id, "service_ids": []}

    result = await db.execute(
        select(Service.service_id).filter(Service.service_id.in_(resolved_ids))
    )
    existing = set(result.scalars().all())
    missing = set(resolved_ids) - existing
    if missing:
        raise HTTPException(
            status_code=400, detail={"missing_ids": sorted(list(missing))}
        )

    await db.execute(
        delete(OperatorService).where(
            OperatorService.operator_id == current_user.user_id
        )
    )
    for sid in resolved_ids:
        db.add(OperatorService(service_id=sid, operator_id=current_user.user_id))

    await db.commit()
    return {"user_id": current_user.user_id, "service_ids": resolved_ids}


@router.get("/services")
async def list_available_services(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Service))
    services = []
    for s in result.scalars().all():
        services.append({"service_id": s.service_id, "name": s.name})
    return services


@router.get("/me/services")
async def get_my_services(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if current_user.role != "ope":
        raise HTTPException(status_code=403, detail="Unauthorized")

    result = await db.execute(
        select(Service.service_id, Service.name)
        .join(OperatorService, OperatorService.service_id == Service.service_id)
        .filter(OperatorService.operator_id == current_user.user_id)
    )
    services = [{"service_id": row[0], "name": row[1]} for row in result.all()]
    return {"user_id": current_user.user_id, "services": services}


@router.post("/me/add_attachments")
async def add_attachment(
    file_url: str | None = Form(None),
    name: str = Form(...),
    description: str | None = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "ope":
        raise HTTPException(status_code=403, detail="Unauthorized")
    if not file_url:
        raise HTTPException(status_code=400, detail="File_url must be provided")

    file_path_value = file_url

    attachment = Attachment(
        name=name,
        description=description,
        file_path=file_path_value,
        operator_id=current_user.user_id,
    )
    db.add(attachment)
    await db.commit()
    await db.refresh(attachment)

    return {
        "attachment_id": attachment.attachment_id,
        "name": attachment.name,
        "description": attachment.description,
        "file_path": attachment.file_path,
    }


@router.delete("/me/remove_attachments/{attachment_id}")
async def remove_attachment(
    attachment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "ope":
        raise HTTPException(status_code=403, detail="Unauthorized")

    result = await db.execute(
        select(Attachment).filter(Attachment.attachment_id == attachment_id)
    )
    att = result.scalars().first()
    if not att:
        raise HTTPException(status_code=404, detail="Attachment not found")
    if att.operator_id != current_user.user_id:
        raise HTTPException(
            status_code=403, detail="Not allowed to delete this attachment"
        )
    await db.execute(
        delete(Attachment).where(Attachment.attachment_id == attachment_id)
    )
    await db.commit()

    return {"detail": "deleted"}


@router.get("/me/attachments")
async def get_my_attachments(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if current_user.role != "ope":
        raise HTTPException(status_code=403, detail="Unauthorized")

    result = await db.execute(
        select(Attachment).filter(Attachment.operator_id == current_user.user_id)
    )
    attachments = []
    for a in result.scalars().all():
        attachments.append(
            {
                "attachment_id": a.attachment_id,
                "name": a.name,
                "description": a.description,
                "file_path": a.file_path,
            }
        )

    return {"user_id": current_user.user_id, "attachments": attachments}
