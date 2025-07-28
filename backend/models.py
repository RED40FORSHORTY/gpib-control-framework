from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Instrument(Base):
    __tablename__ = "instruments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    type = Column(String, nullable=False)  # e.g., "34401A", "34410A"
    gpib_address = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    auto_connect = Column(Boolean, default=False)
    measurement_type = Column(String, default="DC_VOLTAGE")  # DC_VOLTAGE, AC_VOLTAGE, etc.
    range = Column(String, default="AUTO")  # AUTO, 0.1, 1, 10, 100, 1000
    resolution = Column(String, default="6.5")  # 4.5, 5.5, 6.5, 7.5
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now()) 