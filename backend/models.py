from sqlalchemy import Column, Integer, Text, Date, ForeignKey, CHAR, Enum, Float
from datetime import date
from sqlalchemy.orm import relationship, Mapped, mapped_column
from database import Base


class User(Base):
    __tablename__ = "user"

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_name: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    password: Mapped[str] = mapped_column(Text, nullable=False)
    role: Mapped[str] = mapped_column(
        Enum("adm", "cli", "ope", name="role_enum"), nullable=False
    )
    phone_number: Mapped[str] = mapped_column(Text, nullable=False)
    is_blocked: Mapped[str] = mapped_column(CHAR(1), nullable=False, default="N")
    creation_date: Mapped[date] = mapped_column(Date, nullable=False)

    @property
    def roles(self):
        return [self.role]

    localisation: Mapped[str | None] = mapped_column(Text)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    area: Mapped[int | None] = mapped_column(Integer)
    description: Mapped[str | None] = mapped_column(Text)

    attachments = relationship("Attachment", back_populates="operator")
    services_provided = relationship("OperatorService", back_populates="operator")
    orders_as_client = relationship(
        "Order", foreign_keys="[Order.client_id]", back_populates="client"
    )
    orders_as_operator = relationship(
        "Order", foreign_keys="[Order.operator_id]", back_populates="operator"
    )
    reports = relationship("ReportedOperator", back_populates="operator")
    matched_orders = relationship("MatchedOrder", back_populates="operator")


class Attachment(Base):
    __tablename__ = "attachment"

    attachment_id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    description = Column(Text)
    file_path = Column(Text, nullable=False)
    operator_id = Column(Integer, ForeignKey("user.user_id"))

    operator = relationship("User", back_populates="attachments")


class Service(Base):
    __tablename__ = "service"

    service_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)

    operator_services = relationship("OperatorService", back_populates="service")
    parameters = relationship("ServiceParameter", back_populates="service")


class OperatorService(Base):
    __tablename__ = "operator_service"

    entry_id = Column(Integer, primary_key=True)
    service_id = Column(Integer, ForeignKey("service.service_id"))
    operator_id = Column(Integer, ForeignKey("user.user_id"))

    service = relationship("Service", back_populates="operator_services")
    operator = relationship("User", back_populates="services_provided")


class ServiceParameter(Base):
    __tablename__ = "service_parameter"

    parameter_id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    unit = Column(Text, nullable=False)
    service_id = Column(Integer, ForeignKey("service.service_id"))

    service = relationship("Service", back_populates="parameters")
    order_parameters = relationship("OrderParameter", back_populates="parameter")


class Order(Base):
    __tablename__ = "order"

    order_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    creation_date: Mapped[date] = mapped_column(Date, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    raid_date: Mapped[str] = mapped_column(CHAR(1), nullable=False)
    completion_date: Mapped[str] = mapped_column(CHAR(1), nullable=False)
    deadline: Mapped[date] = mapped_column(Date, nullable=False)
    location: Mapped[str] = mapped_column(Text, nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    operator_selection_date: Mapped[date | None] = mapped_column(Date)

    client_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.user_id"))
    operator_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("user.user_id"))

    score: Mapped[int | None] = mapped_column(Integer)
    opinion: Mapped[str | None] = mapped_column(Text)
    state: Mapped[str] = mapped_column(Text, nullable=False)

    order_services = relationship("OrderService", back_populates="order")
    client = relationship(
        "User", foreign_keys=[client_id], back_populates="orders_as_client"
    )
    operator = relationship(
        "User", foreign_keys=[operator_id], back_populates="orders_as_operator"
    )
    order_parameters = relationship("OrderParameter", back_populates="order")
    reported_entries = relationship("ReportedOperator", back_populates="order")
    matched_operators = relationship("MatchedOrder", back_populates="order")


class OrderService(Base):
    __tablename__ = "order_service"
    order_id = Column(Integer, ForeignKey("order.order_id"), primary_key=True)
    service_id = Column(Integer, ForeignKey("service.service_id"), primary_key=True)

    order = relationship("Order", back_populates="order_services")
    service = relationship("Service")


class OrderParameter(Base):
    __tablename__ = "order_parameter"

    entry_id = Column(Integer, primary_key=True)
    value = Column(Text, nullable=False)
    order_id = Column(Integer, ForeignKey("order.order_id"))
    parameter_id = Column(Integer, ForeignKey("service_parameter.parameter_id"))

    order = relationship("Order", back_populates="order_parameters")
    parameter = relationship("ServiceParameter", back_populates="order_parameters")


class ReportedOperator(Base):
    __tablename__ = "reported_operator"

    report_id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    order_id = Column(Integer, ForeignKey("order.order_id"))
    operator_id = Column(Integer, ForeignKey("user.user_id"))

    order = relationship("Order", back_populates="reported_entries")
    operator = relationship("User", back_populates="reports")


class MatchedOrder(Base):
    __tablename__ = "matched_order"

    match_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("order.order_id"))
    operator_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.user_id"))
    status: Mapped[str] = mapped_column(Text, default="pending")

    order = relationship("Order", back_populates="matched_operators")
    operator = relationship("User", back_populates="matched_orders")
