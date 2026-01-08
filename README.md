# 🏎️ F1 Replay Mobile App

A mobile application that visualizes Formula 1 race replays using real telemetry data.
The app allows users to replay races, view driver positions, save favorites, and customize replay performance.

---

## 🧑‍💻 Developers

- Name: Luka Vujic
- Email: LukaVujic04@hotmail.com
- GitHub: https://github.com/LukaVujicSWE

- Name: Marko Vujic
- Email: MarkoVujic24@hotmail.com
- GitHub: https://github.com/MarkoVujic04

---

## 📦 Installation

```bash
git clone https://github.com/<username>/f1-mobile-project.git
cd f1-mobile-project

🔧 Backend Setup
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install fastapi uvicorn fastf1 numpy

🔧 Frontend setup
cd mobile
npm install
npx expo start

```

🧱 Tech Stack
Backend

Python

FastAPI

FastF1 (official F1 telemetry wrapper)

NumPy (interpolation & resampling)

In-memory caching for sessions

Frontend

Expo (React Native)

expo-router

@shopify/react-native-skia

NativeWind (Tailwind CSS)

AsyncStorage (favorites & settings)
