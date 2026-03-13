# CareerPath React Native App

This folder contains a React Native (Expo) Android-ready mobile app that mirrors the existing web frontend flow:

- Landing
- Login / Signup
- Dashboard
- Assessment
- Prediction
- Roadmap (with task toggle + study links)
- Profile (update Current Stage + Achieving Stage)

## 1) Install dependencies

```bash
cd frontend_App
npm install
```

## 2) Configure API URL

By default, Android emulator uses:

- `http://10.0.2.2:8000`

To override, set env var:

```bash
EXPO_PUBLIC_API_BASE_URL=http://<your-host>:8000
```

## 3) Run app

```bash
npm run start
```

Then press:

- `a` for Android emulator

## Notes

- Backend must be running at port `8000`.
- Authentication and profile updates use the same `/api` endpoints as the web app.
- Mobile app state persists with AsyncStorage.
