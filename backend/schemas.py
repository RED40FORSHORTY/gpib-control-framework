from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InstrumentBase(BaseModel):
    name: str
    type: str
    gpib_address: str
    description: Optional[str] = None
    auto_connect: bool = False
    measurement_type: str = "DC_VOLTAGE"
    range: str = "AUTO"
    resolution: str = "6.5"

class InstrumentCreate(InstrumentBase):
    pass

class InstrumentUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    gpib_address: Optional[str] = None
    description: Optional[str] = None
    auto_connect: Optional[bool] = None
    measurement_type: Optional[str] = None
    range: Optional[str] = None
    resolution: Optional[str] = None

class InstrumentResponse(InstrumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MeasurementResponse(BaseModel):
    value: float
    unit: str
    timestamp: datetime
    instrument_id: int
    measurement_type: str
    range: str
    resolution: str 