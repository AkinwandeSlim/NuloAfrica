# 🏗️ Nulo Africa - FastAPI + Next.js Architecture

## Complete Project Restructure with Separation of Concerns

---

## 📁 **New Project Structure**

```
nulo-africa/
├── server/                          # FastAPI Backend (Python)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI app entry point
│   │   ├── config.py                # Configuration & environment
│   │   ├── database.py              # Supabase client setup
│   │   │
│   │   ├── models/                  # Pydantic models (request/response)
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── property.py
│   │   │   ├── application.py
│   │   │   ├── message.py
│   │   │   └── notification.py
│   │   │
│   │   ├── schemas/                 # Database schemas (SQLAlchemy-like)
│   │   │   ├── __init__.py
│   │   │   └── database.py
│   │   │
│   │   ├── routes/                  # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── properties.py
│   │   │   ├── applications.py
│   │   │   ├── tenants.py
│   │   │   ├── messages.py
│   │   │   ├── favorites.py
│   │   │   └── admin.py
│   │   │
│   │   ├── services/                # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── property_service.py
│   │   │   ├── application_service.py
│   │   │   ├── trust_score_service.py
│   │   │   └── notification_service.py
│   │   │
│   │   ├── middleware/              # Custom middleware
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # JWT verification
│   │   │   ├── cors.py              # CORS configuration
│   │   │   └── error_handler.py     # Global error handling
│   │   │
│   │   └── utils/                   # Utility functions
│   │       ├── __init__.py
│   │       ├── validators.py
│   │       ├── helpers.py
│   │       └── constants.py
│   │
│   ├── tests/                       # Backend tests
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_properties.py
│   │   └── test_applications.py
│   │
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment template
│   ├── .env                         # Environment variables (gitignored)
│   └── README.md                    # Backend documentation
│
├── client/                          # Next.js Frontend
│   ├── app/                         # Next.js 13+ app directory
│   │   ├── (public)/                # Public routes
│   │   │   ├── page.tsx             # Landing page
│   │   │   ├── properties/
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   │
│   │   ├── (dashboard)/             # Protected routes
│   │   │   ├── tenant/
│   │   │   ├── landlord/
│   │   │   └── admin/
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/                  # React components
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── forms/
│   │   ├── cards/
│   │   └── layouts/
│   │
│   ├── lib/                         # Client utilities
│   │   ├── api/                     # API client (Axios/Fetch)
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── properties.ts
│   │   │   └── applications.ts
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useProperties.ts
│   │   │   └── useNotifications.ts
│   │   │
│   │   ├── store/                   # Redux store
│   │   │   ├── store.ts
│   │   │   └── slices/
│   │   │
│   │   ├── types/                   # TypeScript types
│   │   │   └── api.ts
│   │   │
│   │   └── utils/                   # Helper functions
│   │       └── helpers.ts
│   │
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── .env.local
│   └── README.md
│
├── database/                        # Database scripts
│   ├── schema.sql                   # Supabase schema
│   ├── rls_policies.sql             # RLS policies
│   ├── seed.sql                     # Sample data
│   └── README.md
│
├── docs/                            # Documentation
│   ├── API.md                       # API documentation
│   ├── SETUP.md                     # Setup guide
│   └── ARCHITECTURE.md              # Architecture overview
│
├── .gitignore                       # Git ignore
├── docker-compose.yml               # Docker setup (optional)
└── README.md                        # Project overview
```

---

## 🚀 **Why This Architecture?**

### **Benefits:**
✅ **Separation of Concerns** - Clear boundaries between frontend/backend
✅ **Independent Deployment** - Deploy client and server separately
✅ **Technology Flexibility** - Use best tools for each layer
✅ **Scalability** - Scale backend independently
✅ **Type Safety** - Python (Pydantic) + TypeScript
✅ **Performance** - FastAPI is one of the fastest Python frameworks
✅ **Developer Experience** - Auto-generated API docs (Swagger/ReDoc)

### **Tech Stack:**
- **Backend:** FastAPI (Python 3.10+) + Supabase (PostgreSQL)
- **Frontend:** Next.js 14 + TypeScript + TailwindCSS
- **State Management:** Redux Toolkit
- **API Communication:** Axios with interceptors
- **Authentication:** JWT tokens (Supabase Auth)
- **Real-time:** Supabase Realtime subscriptions

---

## 📦 **Backend (FastAPI) Setup**

### **Dependencies (requirements.txt):**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
supabase==2.0.3
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
python-dotenv==1.0.0
httpx==0.25.2
```

### **Environment Variables (.env):**
```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# JWT
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Paystack (optional)
PAYSTACK_SECRET_KEY=your_paystack_secret
PAYSTACK_PUBLIC_KEY=your_paystack_public
```

---

## 🎯 **Frontend (Next.js) Setup**

### **Dependencies (package.json):**
```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2",
    "@reduxjs/toolkit": "^2.0.1",
    "react-redux": "^9.0.4",
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.294.0",
    "tailwindcss": "^3.3.0"
  }
}
```

### **Environment Variables (.env.local):**
```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Supabase (for realtime only)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## 🔄 **Communication Flow**

```
┌─────────────┐         HTTP/REST          ┌─────────────┐
│             │  ────────────────────────>  │             │
│   Next.js   │                             │   FastAPI   │
│  (Client)   │  <────────────────────────  │  (Server)   │
│             │      JSON Response          │             │
└─────────────┘                             └─────────────┘
      │                                            │
      │ Realtime (WebSocket)                      │ SQL Queries
      │                                            │
      └──────────────┐                  ┌─────────┘
                     │                  │
                     v                  v
              ┌──────────────────────────┐
              │   Supabase (PostgreSQL)  │
              │   + Realtime + Storage   │
              └──────────────────────────┘
```

---

## 🛠️ **Implementation Steps**

### **Step 1: Setup Backend (FastAPI)**
```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **Step 2: Setup Frontend (Next.js)**
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Run development server
npm run dev
```

### **Step 3: Setup Database**
```bash
# Run in Supabase SQL Editor
# 1. Execute database/schema.sql
# 2. Execute database/rls_policies.sql
# 3. Execute database/seed.sql (optional)
```

---

## 📡 **API Endpoints Structure**

### **Base URL:** `http://localhost:8000/api/v1`

### **Authentication:**
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

### **Properties:**
- `GET /properties/search` - Search properties
- `POST /properties` - Create property
- `GET /properties/{id}` - Get property
- `PATCH /properties/{id}` - Update property
- `DELETE /properties/{id}` - Delete property

### **Applications:**
- `POST /applications` - Submit application
- `GET /applications` - Get user applications
- `PATCH /applications/{id}/approve` - Approve application
- `PATCH /applications/{id}/reject` - Reject application

### **Tenants:**
- `GET /tenants/profile` - Get tenant profile
- `POST /tenants/complete-profile` - Complete profile
- `PATCH /tenants/profile` - Update profile

### **Messages:**
- `GET /messages/conversations` - Get conversations
- `GET /messages/{user_id}` - Get messages with user
- `POST /messages` - Send message

### **Favorites:**
- `GET /favorites` - Get favorites
- `POST /favorites` - Add favorite
- `DELETE /favorites/{property_id}` - Remove favorite

---

## 🔐 **Authentication Flow**

```
1. User logs in via Next.js form
   ↓
2. Next.js sends credentials to FastAPI
   POST /api/v1/auth/login
   ↓
3. FastAPI validates with Supabase Auth
   ↓
4. FastAPI returns JWT token + user data
   ↓
5. Next.js stores token in localStorage/cookie
   ↓
6. Next.js includes token in all API requests
   Authorization: Bearer <token>
   ↓
7. FastAPI middleware validates token
   ↓
8. FastAPI processes request
```

---

## 🎨 **Code Examples**

### **FastAPI Route Example:**
```python
# server/app/routes/properties.py
from fastapi import APIRouter, Depends, HTTPException
from app.models.property import PropertyCreate, PropertyResponse
from app.services.property_service import PropertyService
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/properties", tags=["properties"])

@router.post("/", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    current_user = Depends(get_current_user)
):
    if current_user.user_type != "landlord":
        raise HTTPException(403, "Only landlords can create properties")
    
    service = PropertyService()
    return await service.create_property(property_data, current_user.id)
```

### **Next.js API Client Example:**
```typescript
// client/lib/api/properties.ts
import { apiClient } from './client'

export const propertyApi = {
  search: async (filters: PropertyFilters) => {
    const { data } = await apiClient.get('/properties/search', { params: filters })
    return data
  },
  
  create: async (propertyData: PropertyCreate) => {
    const { data } = await apiClient.post('/properties', propertyData)
    return data
  },
  
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/properties/${id}`)
    return data
  }
}
```

---

## 📝 **Next Steps**

I'll now create:
1. ✅ Complete FastAPI backend structure
2. ✅ Python models and schemas
3. ✅ All API routes
4. ✅ Services layer
5. ✅ Middleware (auth, CORS, error handling)
6. ✅ Next.js API client
7. ✅ Updated hooks for API communication

Ready to proceed? 🚀
