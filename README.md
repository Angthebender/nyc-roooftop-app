# 🏙️ TopSpot – NYC Rooftop Finder  
Discover, search, and save the best rooftop spots in New York City.

---

## 📱 What it does
- **Browse** curated rooftop bars, lounges, and hidden gems  
- **Swipe-able photos** with dots & counter (every rooftop has multiple pics)  
- **Live search** by name or neighbourhood  
- **Sort** by distance or rating  
- **Save favourites** (profile coming next)  
- **Dark / light mode** support  

Built with **React-Native (Expo)** + **FastAPI** + **Supabase**.

---

## 🧱 Stack
| Layer | Tech |
|-------|------|
| Frontend | React-Native, Expo, TypeScript, NativeWind |
| Navigation | Expo Router (file-based) |
| Backend | Python FastAPI |
| Database & Auth | Supabase (PostgreSQL + Storage) |
| Images | Supabase Storage (public buckets) |

---

## 🚀 Quick Start (local)

### 1. Clone
```bash
git clone https://github.com/your-username/topspot.git
cd topspot
```

### 2. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # add your Supabase keys
uvicorn main:app --reload        # runs on http://127.0.0.1:5000
```

### 3. Frontend
```bash
cd topspot
npm install
cp .env.example .env             # add EXPO_PUBLIC_BACKEND_API_URL
npx expo start
```
Scan the QR code with **Expo Go** (iOS/Android) or press `w` for web.

---

## 📁 Project Structure
```
topspot/
├─ backend/                 # FastAPI server
│  ├─ main.py               # Rooftop & search endpoints
│  ├─ requirements.txt
│  └─ .env                  # Supabase keys (never commit)
├─ app/                     # Expo Router pages
│  ├─ (tabs)/               # Bottom-tabs: Home | Search | Profile
│  ├─ pages/                # Stack screens: Detail, etc.
│  ├─ components/           # Reusable cards, gallery, stars
│  └─ constants/            # Colors, types
├─ assets/                  # Fonts, icons, images
└─ .env                     # Frontend env (EXPO_PUBLIC_*)
```

---

## 🔑 Environment Variables

### Backend `.env`
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR...
```

### Frontend `.env`
```
EXPO_PUBLIC_BACKEND_API_URL=http://127.0.0.1:5000
```

---

## 🔌 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rooftops` | All rooftops + image arrays |
| GET | `/search?q=sky&sort=rating` | Filter + sort |
| GET | `/rooftops/nearby?lat=…&lng=…` | Near-me (coming) |

---

## 🧪 Scripts
```bash
# lint & type-check
npm run lint
npm run type-check

# backend tests
cd backend && pytest
```

---

## 📸 Screenshots
*(Add once you capture them)*

---

## ✅ MVP Checklist
- [x] Browse rooftops  
- [x] Swipe gallery with dots & counter  
- [x] Search by name / location  
- [x] Sort by rating  
- [ ] Maps + distance sort  
- [ ] Detail page (reviews, submit rating)  
- [ ] Favourites & Profile  
- [ ] Dark-mode polish  

---

## 🤝 Contribute
1. Fork  
2. Feature branch: `git checkout -b feature/maps`  
3. Commit & push  
4. Open PR

---

## 📄 License
MIT © 2024 Norden Sherpa

---

> Built for sunset lovers, city explorers, and rooftop hunters. 🌇
