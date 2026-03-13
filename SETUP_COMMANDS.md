# CareerPath Setup Commands (Fresh Clone)

## 1) Clone project

```powershell
git clone <your-repo-url>
cd CareerPath
```

## 2) Backend setup (FastAPI)

Open a new terminal:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

Optional environment variables:

```powershell
$env:JWT_SECRET = "change-me-before-production"
$env:MONGO_URI = "mongodb://localhost:27017"
$env:MONGO_DB_NAME = "career_readiness"
```

Run backend:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check:

```powershell
Invoke-WebRequest -Uri http://localhost:8000/health -UseBasicParsing
```

## 3) Web frontend setup (Next.js)

Open another terminal:

```powershell
cd Frontend
npm install
npm run dev
```

Web app URL:

```text
http://localhost:3000
```

## 4) Mobile app setup (React Native / Expo)

Open another terminal:

```powershell
cd frontend_App
npm install
npm run start
```

Android emulator API URL is already handled in code as `http://10.0.2.2:8000`.
For a physical device, set:

```powershell
$env:EXPO_PUBLIC_API_BASE_URL = "http://<your-lan-ip>:8000"
npm run start
```

## 5) ML scripts setup (dataset and model training)

Open another terminal:

```powershell
cd ml
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

Run scripts (example order):

```powershell
python generate_dataset.py
python train_model.py
python generate_assessment_dataset.py
python train_assessment_model.py
```

## 6) Daily run (after first-time setup)

### Terminal 1 (backend)

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 (web)

```powershell
cd Frontend
npm run dev
```

### Terminal 3 (mobile optional)

```powershell
cd frontend_App
npm run start
```
