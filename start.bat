@echo off
echo Starting GPIB Control Framework...
echo.

echo Building and starting Docker containers...
docker-compose up -d --build

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo Services are starting up:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - API Documentation: http://localhost:8000/docs
echo.

echo To view logs, run: docker-compose logs -f
echo To stop the application, run: docker-compose down
echo.

pause 