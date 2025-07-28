from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
from datetime import datetime

from database import get_db, engine
from models import Base, Instrument
from schemas import InstrumentCreate, InstrumentUpdate, InstrumentResponse
from gpib_manager import GPIBManager

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GPIB Control Framework API",
    description="API for managing GPIB instruments",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize GPIB manager
gpib_manager = GPIBManager()

@app.get("/")
async def root():
    return {
        "message": "GPIB Control Framework API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/instruments", response_model=List[InstrumentResponse])
async def get_instruments(db: Session = Depends(get_db)):
    """Get all instruments"""
    instruments = db.query(Instrument).all()
    return instruments

@app.get("/api/instruments/{instrument_id}", response_model=InstrumentResponse)
async def get_instrument(instrument_id: int, db: Session = Depends(get_db)):
    """Get a specific instrument by ID"""
    instrument = db.query(Instrument).filter(Instrument.id == instrument_id).first()
    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found")
    return instrument

@app.post("/api/instruments", response_model=InstrumentResponse)
async def create_instrument(
    instrument: InstrumentCreate, 
    db: Session = Depends(get_db)
):
    """Create a new instrument"""
    db_instrument = Instrument(
        name=instrument.name,
        type=instrument.type,
        gpib_address=instrument.gpib_address,
        description=instrument.description,
        auto_connect=instrument.auto_connect,
        measurement_type=instrument.measurement_type,
        range=instrument.range,
        resolution=instrument.resolution,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(db_instrument)
    db.commit()
    db.refresh(db_instrument)
    
    return db_instrument

@app.put("/api/instruments/{instrument_id}", response_model=InstrumentResponse)
async def update_instrument(
    instrument_id: int,
    instrument: InstrumentUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing instrument"""
    db_instrument = db.query(Instrument).filter(Instrument.id == instrument_id).first()
    if not db_instrument:
        raise HTTPException(status_code=404, detail="Instrument not found")
    
    # Update fields
    for field, value in instrument.dict(exclude_unset=True).items():
        setattr(db_instrument, field, value)
    
    db_instrument.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_instrument)
    
    return db_instrument

@app.delete("/api/instruments/{instrument_id}")
async def delete_instrument(instrument_id: int, db: Session = Depends(get_db)):
    """Delete an instrument"""
    db_instrument = db.query(Instrument).filter(Instrument.id == instrument_id).first()
    if not db_instrument:
        raise HTTPException(status_code=404, detail="Instrument not found")
    
    db.delete(db_instrument)
    db.commit()
    
    return {"message": "Instrument deleted successfully"}

@app.post("/api/instruments/{instrument_id}/connect")
async def connect_instrument(instrument_id: int, db: Session = Depends(get_db)):
    """Connect to an instrument"""
    instrument = db.query(Instrument).filter(Instrument.id == instrument_id).first()
    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found")
    
    try:
        success = await gpib_manager.connect_instrument(instrument)
        return {"message": "Connected successfully" if success else "Connection failed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/instruments/{instrument_id}/disconnect")
async def disconnect_instrument(instrument_id: int, db: Session = Depends(get_db)):
    """Disconnect from an instrument"""
    instrument = db.query(Instrument).filter(Instrument.id == instrument_id).first()
    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found")
    
    try:
        success = await gpib_manager.disconnect_instrument(instrument)
        return {"message": "Disconnected successfully" if success else "Disconnection failed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/instruments/{instrument_id}/measure")
async def measure_instrument(instrument_id: int, db: Session = Depends(get_db)):
    """Take a measurement from an instrument"""
    instrument = db.query(Instrument).filter(Instrument.id == instrument_id).first()
    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found")
    
    try:
        measurement = await gpib_manager.take_measurement(instrument)
        return measurement
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "gpib_manager_status": gpib_manager.get_status()
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 