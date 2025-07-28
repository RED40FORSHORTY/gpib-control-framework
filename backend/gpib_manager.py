import asyncio
import random
from typing import Dict, Optional, Any
from datetime import datetime
from models import Instrument

class GPIBManager:
    """
    Object-oriented GPIB manager for instrument communication.
    Supports different instrument types with specific implementations.
    """
    
    def __init__(self):
        self.connected_instruments: Dict[int, 'GPIBInstrument'] = {}
        self.instrument_classes = {
            '34401A': HP34401A,
            '34410A': Agilent34410A,
            '34461A': Keysight34461A,
            '34465A': Keysight34465A,
            'custom': CustomInstrument
        }
    
    async def connect_instrument(self, instrument: Instrument) -> bool:
        """Connect to an instrument"""
        try:
            if instrument.id in self.connected_instruments:
                return True
            
            # Get the appropriate instrument class
            instrument_class = self.instrument_classes.get(
                instrument.type, 
                CustomInstrument
            )
            
            # Create and connect the instrument
            gpib_instrument = instrument_class(instrument)
            success = await gpib_instrument.connect()
            
            if success:
                self.connected_instruments[instrument.id] = gpib_instrument
                return True
            return False
            
        except Exception as e:
            print(f"Error connecting to instrument {instrument.id}: {e}")
            return False
    
    async def disconnect_instrument(self, instrument: Instrument) -> bool:
        """Disconnect from an instrument"""
        try:
            if instrument.id in self.connected_instruments:
                gpib_instrument = self.connected_instruments[instrument.id]
                await gpib_instrument.disconnect()
                del self.connected_instruments[instrument.id]
                return True
            return True  # Already disconnected
            
        except Exception as e:
            print(f"Error disconnecting from instrument {instrument.id}: {e}")
            return False
    
    async def take_measurement(self, instrument: Instrument) -> Dict[str, Any]:
        """Take a measurement from an instrument"""
        try:
            if instrument.id not in self.connected_instruments:
                raise Exception("Instrument not connected")
            
            gpib_instrument = self.connected_instruments[instrument.id]
            measurement = await gpib_instrument.measure()
            return measurement
            
        except Exception as e:
            raise Exception(f"Error taking measurement: {e}")
    
    def get_status(self) -> Dict[str, Any]:
        """Get the status of the GPIB manager"""
        return {
            "connected_instruments": len(self.connected_instruments),
            "instrument_ids": list(self.connected_instruments.keys()),
            "available_classes": list(self.instrument_classes.keys())
        }
    
    def is_connected(self, instrument_id: int) -> bool:
        """Check if an instrument is connected"""
        return instrument_id in self.connected_instruments


class GPIBInstrument:
    """
    Base class for GPIB instruments.
    Provides common functionality and interface for all instruments.
    """
    
    def __init__(self, instrument: Instrument):
        self.instrument = instrument
        self.connected = False
        self.last_measurement = None
    
    async def connect(self) -> bool:
        """Connect to the instrument"""
        try:
            # Simulate connection delay
            await asyncio.sleep(0.5)
            
            # Simulate connection success/failure
            self.connected = random.random() > 0.1  # 90% success rate
            return self.connected
            
        except Exception as e:
            print(f"Connection error: {e}")
            self.connected = False
            return False
    
    async def disconnect(self) -> bool:
        """Disconnect from the instrument"""
        try:
            await asyncio.sleep(0.2)
            self.connected = False
            return True
        except Exception as e:
            print(f"Disconnection error: {e}")
            return False
    
    async def measure(self) -> Dict[str, Any]:
        """Take a measurement"""
        if not self.connected:
            raise Exception("Instrument not connected")
        
        # This should be overridden by subclasses
        raise NotImplementedError("Subclasses must implement measure()")
    
    async def send_command(self, command: str) -> str:
        """Send a command to the instrument"""
        if not self.connected:
            raise Exception("Instrument not connected")
        
        # Simulate command execution
        await asyncio.sleep(0.1)
        return f"OK: {command}"
    
    async def query(self, query: str) -> str:
        """Send a query to the instrument and get response"""
        if not self.connected:
            raise Exception("Instrument not connected")
        
        # Simulate query response
        await asyncio.sleep(0.1)
        return f"Response to: {query}"


class HP34401A(GPIBInstrument):
    """
    HP 34401A Multimeter implementation
    """
    
    async def measure(self) -> Dict[str, Any]:
        """Take a measurement with HP 34401A"""
        if not self.connected:
            raise Exception("Instrument not connected")
        
        # Simulate measurement delay
        await asyncio.sleep(0.3)
        
        # Generate realistic measurement value
        base_value = random.uniform(0.5, 9.5)
        noise = random.uniform(-0.01, 0.01)
        value = base_value + noise
        
        # Determine unit based on measurement type
        unit_map = {
            'DC_VOLTAGE': 'V DC',
            'AC_VOLTAGE': 'V AC',
            'DC_CURRENT': 'A DC',
            'AC_CURRENT': 'A AC',
            'RESISTANCE': 'Ω',
            'FREQUENCY': 'Hz',
            'PERIOD': 's'
        }
        
        unit = unit_map.get(self.instrument.measurement_type, 'V DC')
        
        self.last_measurement = {
            "value": round(value, 6),
            "unit": unit,
            "timestamp": datetime.utcnow().isoformat(),
            "instrument_id": self.instrument.id,
            "measurement_type": self.instrument.measurement_type,
            "range": self.instrument.range,
            "resolution": self.instrument.resolution,
            "instrument_type": "HP 34401A"
        }
        
        return self.last_measurement


class Agilent34410A(GPIBInstrument):
    """
    Agilent 34410A Multimeter implementation
    """
    
    async def measure(self) -> Dict[str, Any]:
        """Take a measurement with Agilent 34410A"""
        if not self.connected:
            raise Exception("Instrument not connected")
        
        await asyncio.sleep(0.25)
        
        # Agilent 34410A has slightly different characteristics
        base_value = random.uniform(0.3, 8.7)
        noise = random.uniform(-0.005, 0.005)  # Lower noise
        value = base_value + noise
        
        unit_map = {
            'DC_VOLTAGE': 'V DC',
            'AC_VOLTAGE': 'V AC',
            'DC_CURRENT': 'A DC',
            'AC_CURRENT': 'A AC',
            'RESISTANCE': 'Ω',
            'FREQUENCY': 'Hz',
            'PERIOD': 's'
        }
        
        unit = unit_map.get(self.instrument.measurement_type, 'V DC')
        
        self.last_measurement = {
            "value": round(value, 6),
            "unit": unit,
            "timestamp": datetime.utcnow().isoformat(),
            "instrument_id": self.instrument.id,
            "measurement_type": self.instrument.measurement_type,
            "range": self.instrument.range,
            "resolution": self.instrument.resolution,
            "instrument_type": "Agilent 34410A"
        }
        
        return self.last_measurement


class Keysight34461A(GPIBInstrument):
    """
    Keysight 34461A Multimeter implementation
    """
    
    async def measure(self) -> Dict[str, Any]:
        """Take a measurement with Keysight 34461A"""
        if not self.connected:
            raise Exception("Instrument not connected")
        
        await asyncio.sleep(0.2)
        
        # Keysight 34461A has higher precision
        base_value = random.uniform(0.1, 9.9)
        noise = random.uniform(-0.001, 0.001)  # Very low noise
        value = base_value + noise
        
        unit_map = {
            'DC_VOLTAGE': 'V DC',
            'AC_VOLTAGE': 'V AC',
            'DC_CURRENT': 'A DC',
            'AC_CURRENT': 'A AC',
            'RESISTANCE': 'Ω',
            'FREQUENCY': 'Hz',
            'PERIOD': 's'
        }
        
        unit = unit_map.get(self.instrument.measurement_type, 'V DC')
        
        self.last_measurement = {
            "value": round(value, 7),  # Higher precision
            "unit": unit,
            "timestamp": datetime.utcnow().isoformat(),
            "instrument_id": self.instrument.id,
            "measurement_type": self.instrument.measurement_type,
            "range": self.instrument.range,
            "resolution": self.instrument.resolution,
            "instrument_type": "Keysight 34461A"
        }
        
        return self.last_measurement


class Keysight34465A(GPIBInstrument):
    """
    Keysight 34465A Multimeter implementation
    """
    
    async def measure(self) -> Dict[str, Any]:
        """Take a measurement with Keysight 34465A"""
        if not self.connected:
            raise Exception("Instrument not connected")
        
        await asyncio.sleep(0.15)
        
        # Keysight 34465A has highest precision
        base_value = random.uniform(0.05, 9.95)
        noise = random.uniform(-0.0001, 0.0001)  # Minimal noise
        value = base_value + noise
        
        unit_map = {
            'DC_VOLTAGE': 'V DC',
            'AC_VOLTAGE': 'V AC',
            'DC_CURRENT': 'A DC',
            'AC_CURRENT': 'A AC',
            'RESISTANCE': 'Ω',
            'FREQUENCY': 'Hz',
            'PERIOD': 's'
        }
        
        unit = unit_map.get(self.instrument.measurement_type, 'V DC')
        
        self.last_measurement = {
            "value": round(value, 8),  # Highest precision
            "unit": unit,
            "timestamp": datetime.utcnow().isoformat(),
            "instrument_id": self.instrument.id,
            "measurement_type": self.instrument.measurement_type,
            "range": self.instrument.range,
            "resolution": self.instrument.resolution,
            "instrument_type": "Keysight 34465A"
        }
        
        return self.last_measurement


class CustomInstrument(GPIBInstrument):
    """
    Custom instrument implementation for unknown instrument types
    """
    
    async def measure(self) -> Dict[str, Any]:
        """Take a measurement with custom instrument"""
        if not self.connected:
            raise Exception("Instrument not connected")
        
        await asyncio.sleep(0.4)
        
        # Generic measurement for custom instruments
        base_value = random.uniform(0.0, 10.0)
        noise = random.uniform(-0.05, 0.05)
        value = base_value + noise
        
        unit_map = {
            'DC_VOLTAGE': 'V DC',
            'AC_VOLTAGE': 'V AC',
            'DC_CURRENT': 'A DC',
            'AC_CURRENT': 'A AC',
            'RESISTANCE': 'Ω',
            'FREQUENCY': 'Hz',
            'PERIOD': 's'
        }
        
        unit = unit_map.get(self.instrument.measurement_type, 'V DC')
        
        self.last_measurement = {
            "value": round(value, 4),
            "unit": unit,
            "timestamp": datetime.utcnow().isoformat(),
            "instrument_id": self.instrument.id,
            "measurement_type": self.instrument.measurement_type,
            "range": self.instrument.range,
            "resolution": self.instrument.resolution,
            "instrument_type": f"Custom: {self.instrument.type}"
        }
        
        return self.last_measurement 