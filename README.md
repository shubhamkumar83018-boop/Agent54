# ASTITWAA — AGENT 54

AI Regulatory Compliance & Inspection Readiness Agent

## Running the Application Locally (VS Code)

To run the application, you need to start both the backend (FastAPI) and the frontend (React/Vite) servers. 

### 1. Start the Backend Server

1. Open a new Terminal in VS Code (`Terminal` -> `New Terminal`).
2. Activate the Python virtual environment:
   ```powershell
   .\backend\venv\Scripts\activate
   ```
3. Run the database seed script (only needed once to populate demo data):
   ```powershell
   python -m backend.seed
   ```
4. Start the FastAPI development server:
   ```powershell
   python -m uvicorn backend.main:app --reload
   ```
   *The backend API will be available at: http://localhost:8000*
   *Interactive API Docs (Swagger UI): http://localhost:8000/docs*

### 2. Start the Frontend Server

1. Open a **second** new Terminal in VS Code.
2. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   *The frontend UI will be available at: http://localhost:5173* (or whichever port Vite assigns, check the terminal output).

## Project Structure
* `/backend` - Python FastAPI server, SQLAlchemy database models, AI agents, and rule engine.
* `/frontend` - React, Vite, Tailwind CSS, TypeScript frontend.
* `/data` - Directory for storing local SQLite database and uploaded evidence files.
