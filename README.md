# GPIB Control Framework

A modern, Docker-based framework for remote GPIB instrument control with a beautiful, responsive web interface. Built with React frontend, FastAPI backend, and PostgreSQL database.

## Features

- 🎨 **Modern UI**: Beautiful, responsive interface with glassmorphism design
- 🔧 **Object-Oriented Design**: Easy to add new instrument types
- 📱 **Draggable & Resizable**: Move and resize instrument panels
- ⚡ **Real-time Updates**: Live measurement data and connection status
- 🐳 **Docker Support**: Complete containerized solution
- 🔌 **GPIB Support**: Ready for real GPIB hardware integration
- 📊 **Instrument Management**: Add, edit, delete instruments with settings

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gpib-control-framework
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Architecture

### Frontend (React)
- **Location**: `frontend/`
- **Port**: 3000
- **Features**:
  - Modern React with hooks
  - Styled-components for styling
  - Framer Motion for animations
  - React Query for data management
  - Draggable and resizable instrument panels

### Backend (FastAPI)
- **Location**: `backend/`
- **Port**: 8000
- **Features**:
  - FastAPI with automatic API documentation
  - SQLAlchemy ORM
  - PostgreSQL database
  - Object-oriented GPIB instrument management
  - Async/await support

### Database (PostgreSQL)
- **Port**: 5432
- **Features**:
  - Persistent instrument storage
  - ACID compliance
  - Connection pooling

## Instrument Types

The framework supports multiple instrument types with specific implementations:

### HP 34401A Multimeter
- 6½ digit precision
- DC/AC voltage, current, resistance measurements
- Auto-ranging capability

### Agilent 34410A Multimeter
- Enhanced precision over HP 34401A
- Lower noise characteristics
- Faster measurement times

### Keysight 34461A Multimeter
- 6½ digit precision
- Higher accuracy than previous models
- Advanced measurement capabilities

### Keysight 34465A Multimeter
- 6½ digit precision
- Highest accuracy in the series
- Premium measurement features

### Custom Instruments
- Extensible framework for any instrument type
- Configurable measurement parameters
- Custom command support

## Adding New Instruments

### 1. Create Instrument Class
```python
# backend/gpib_manager.py
class NewInstrument(GPIBInstrument):
    async def measure(self) -> Dict[str, Any]:
        # Implement measurement logic
        pass
```

### 2. Register in GPIBManager
```python
self.instrument_classes = {
    '34401A': HP34401A,
    'NEW_TYPE': NewInstrument,  # Add here
    # ...
}
```

### 3. Add to Frontend
```javascript
// frontend/src/components/InstrumentSettings.js
<option value="NEW_TYPE">New Instrument Type</option>
```

## API Endpoints

### Instruments
- `GET /api/instruments` - List all instruments
- `GET /api/instruments/{id}` - Get specific instrument
- `POST /api/instruments` - Create new instrument
- `PUT /api/instruments/{id}` - Update instrument
- `DELETE /api/instruments/{id}` - Delete instrument

### Instrument Control
- `POST /api/instruments/{id}/connect` - Connect to instrument
- `POST /api/instruments/{id}/disconnect` - Disconnect from instrument
- `POST /api/instruments/{id}/measure` - Take measurement

### System
- `GET /` - API information
- `GET /api/health` - Health check

## Development

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## Configuration

### Environment Variables

#### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8000)

#### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `PYTHONPATH`: Python path for imports

#### Database
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

## GPIB Integration

### Real Hardware Setup

1. **Install GPIB Drivers**
   - Windows: NI-VISA
   - Linux: Linux-GPIB
   - macOS: NI-VISA

2. **Configure GPIB Address**
   - Set instrument GPIB address in settings
   - Ensure address matches physical instrument

3. **Test Connection**
   - Use "Test Connection" button in settings
   - Verify instrument responds

### Simulated Mode

The framework includes simulated instruments for development and testing:
- Realistic measurement values
- Connection simulation
- Configurable response times

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :3000
   # Kill the process
   taskkill /PID <PID> /F
   ```

2. **Database Connection Issues**
   ```bash
   # Restart database container
   docker-compose restart db
   ```

3. **Frontend Not Loading**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at http://localhost:8000/docs
- Review the troubleshooting section above 