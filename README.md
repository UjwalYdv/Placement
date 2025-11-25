
# FuelEU Maritime Compliance Platform

A full-stack TypeScript application for managing maritime fuel compliance according to EU Regulation 2023/1805.

## 🏗️ Architecture

This project follows **Hexagonal Architecture (Ports & Adapters)** principles:

```
┌─────────────────────────────────────────┐
│             Application                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐  │
│  │         Core Domain             │  │
│  │  (Business Logic & Entities)    │  │
│  └─────────────────────────────────┘  │
│              ↕️ Ports                   │
│  ┌──────────────┐    ┌─────────────┐  │
│  │   Inbound    │    │  Outbound   │  │
│  │   (HTTP)     │    │  (Postgres) │  │
│  └──────────────┘    └─────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Backend Structure

```
backend/
├── src/
│   ├── core/                   # Business logic layer
│   │   ├── domain/            # Entities and value objects
│   │   ├── application/       # Use cases
│   │   └── ports/             # Interfaces
│   ├── adapters/
│   │   ├── inbound/http/      # REST API controllers
│   │   └── outbound/postgres/ # Database repositories
│   ├── infrastructure/
│   │   ├── db/               # Database connection & migrations
│   │   └── server/           # Express server setup
│   └── shared/               # Utilities
├── tests/                     # Unit & integration tests
└── package.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── core/                  # Business logic layer
│   │   ├── domain/           # Entities and types
│   │   ├── application/      # (Reserved for complex logic)
│   │   └── ports/            # Service interfaces
│   ├── adapters/
│   │   ├── ui/               # React components & hooks
│   │   └── infrastructure/   # API clients
│   ├── shared/               # Utilities
│   ├── App.tsx               # Main application
│   └── index.tsx             # Entry point
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- macOS, Linux, or Windows with WSL

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create database
createdb fueleu_maritime

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations and seed data
npm run migrate

# Start development server
npm run dev
```

Backend will run on `http://localhost:3001`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Ensure REACT_APP_API_URL=http://localhost:3001/api

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

## 📊 Features

### 1. Routes Management
- View all maritime routes with filtering
- Filter by vessel type, fuel type, and year
- Set baseline route for comparisons
- Display GHG intensity, fuel consumption, distance, and emissions

### 2. Comparison Analysis
- Compare routes against baseline
- Calculate percentage difference in GHG intensity
- Visualize data with interactive charts
- Target intensity: 89.3368 gCO₂e/MJ (2% below 91.16)
- Compliance indicators (✅ compliant / ❌ non-compliant)

### 3. Banking (Article 20)
- Bank positive compliance balance for future use
- Apply previously banked surplus to deficits
- View banking history and available balance
- Validation: Cannot bank when CB ≤ 0

### 4. Pooling (Article 21)
- Create compliance pools with multiple ships
- Transfer surplus from positive CB ships to deficit ships
- Greedy allocation algorithm
- Constraints:
  - Total pool CB must be ≥ 0
  - Deficit ships cannot exit worse
  - Surplus ships cannot exit negative

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test suite
npm test -- ComputeComparison
```

### Test Coverage
- ✅ Unit tests for all use cases
- ✅ Integration tests for API endpoints
- ✅ Database operations
- ✅ Edge cases and error handling

## 📡 API Endpoints

### Routes
- `GET /api/routes` - Get all routes (with filters)
- `POST /api/routes/:routeId/baseline` - Set baseline route
- `GET /api/routes/comparison` - Get comparison data

### Compliance
- `GET /api/compliance/cb?shipId=X&year=Y` - Get compliance balance
- `POST /api/compliance/cb` - Compute and save CB
- `GET /api/compliance/adjusted-cb?shipId=X&year=Y` - Get adjusted CB

### Banking
- `POST /api/banking/bank` - Bank surplus
- `POST /api/banking/apply` - Apply banked surplus
- `GET /api/banking/records?shipId=X&year=Y` - Get banking records

### Pooling
- `POST /api/pools` - Create pool
- `GET /api/pools?year=Y` - Get pools by year

## 📐 Core Formulas

### Compliance Balance (CB)
```
CB = (Target Intensity - Actual Intensity) × Energy in Scope
Energy in Scope = Fuel Consumption × 41,000 MJ/t
Target Intensity (2025) = 89.3368 gCO₂e/MJ
```

### Comparison Percentage
```
Percentage Difference = ((Comparison / Baseline) - 1) × 100
```

### Pooling Allocation
1. Sort members by CB descending (surplus first)
2. Transfer surplus to deficits using greedy algorithm
3. Validate constraints after allocation

## 🎨 Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5+
- **Framework:** Express.js
- **Database:** PostgreSQL 15+
- **ORM:** Direct SQL with `pg` driver
- **Testing:** Jest + Supertest

### Frontend
- **Framework:** React 18+
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios

## 🔧 Development Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run migrate` - Run database migrations

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint code

## 📝 Sample Data

The database is seeded with 5 sample routes:

| Route | Vessel Type | Fuel | Year | GHG Intensity |
|-------|-------------|------|------|---------------|
| R001  | Container   | HFO  | 2024 | 91.0          |
| R002  | BulkCarrier | LNG  | 2024 | 88.0          |
| R003  | Tanker      | MGO  | 2024 | 93.5          |
| R004  | RoRo        | HFO  | 2025 | 89.2          |
| R005  | Container   | LNG  | 2025 | 90.5          |

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Restart PostgreSQL (macOS)
brew services restart postgresql@15

# Check database exists
psql -l | grep fueleu_maritime
```

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📸 Screenshots

### Routes Tab
Displays all maritime routes with filtering options and baseline selection.

### Compare Tab
Shows comparison analysis with charts and compliance indicators.

### Banking Tab
Manage compliance balance banking and application.

### Pooling Tab
Create and manage compliance pools with multiple ships.

## 📚 References

- [FuelEU Maritime Regulation (EU) 2023/1805](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1805)
- [Annex IV - Well-to-Wake Emissions Factors](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1805#d1e32-139-1)
- [Article 20 - Banking](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1805#d1e32-139-1)
- [Article 21 - Pooling](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1805#d1e32-139-1)

## 👥 Contributors

This project was developed as part of a technical assessment for Full-Stack Developer position.

## 📄 License

MIT License - See LICENSE file for details
