# Interactive Product Analytics Dashboard

A full-stack product analytics dashboard that visualizes its own usage. Every user interaction (filter change, chart click) is tracked and fed back into the visualization.

## Tech Stack

| Layer    | Technology                                        |
| -------- | ------------------------------------------------- |
| Backend  | Node.js, Express, PostgreSQL, JWT, bcrypt         |
| Frontend | React 18, Vite, Tailwind CSS v4, Recharts         |
| Auth     | JSON Web Tokens (stored in localStorage)          |
| State    | Cookies (filter persistence via `js-cookie`)      |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection & env validation
│   │   ├── controllers/   # Auth, analytics, tracking logic
│   │   ├── middleware/     # JWT authentication guard
│   │   ├── models/        # User & FeatureClick DB queries
│   │   ├── routes/        # Express route definitions
│   │   └── utils/         # SQL query-building helpers
│   ├── seeders/           # Database seed script
│   └── server.js          # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # Charts, layout, UI primitives
│   │   ├── context/       # AuthContext, ToastContext
│   │   ├── hooks/         # usePersistedFilters (cookie-backed)
│   │   ├── pages/         # Login, Register, Dashboard, Landing
│   │   ├── services/      # Axios API wrappers
│   │   └── utils/         # Cookie read/write helpers
│   └── index.html
└── README.md              # ← you are here
```

## Running Locally

### Prerequisites

- Node.js >= 18
- PostgreSQL running locally (or a remote instance)

### 1. Backend

```bash
cd backend
cp .env.example .env        # then edit .env with your Postgres credentials
npm install
npm run seed                 # creates tables & populates dummy data
npm run dev                  # starts the server on http://localhost:5000
```

The `.env` file requires:

```
DB_USER=postgres
DB_PASSWORD=<your_password>
DB_HOST=localhost
DB_PORT=5432
DB_NAME=analytics_dashboard
JWT_SECRET=<any_random_string>
PORT=5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env        # default points to http://localhost:5000/api
npm install
npm run dev                  # starts Vite dev server on http://localhost:3000
```

Open **http://localhost:3000** in your browser. Register a new account or log in with any seeded user (password: `password123`).

## Data Seeding

Run the seed script from the backend directory:

```bash
cd backend
npm run seed
```

This will:

1. Drop and recreate the `users` and `feature_clicks` tables.
2. Insert 10-20 random users with varied ages and genders.
3. Insert 100-300 feature click records spread across the last 30 days.

After seeding, the dashboard will display meaningful charts immediately.

## Architectural Choices

- **PostgreSQL** was chosen over SQLite for production readiness, concurrent-write support, and ease of deployment on platforms like Render/Railway.
- **Express** provides a minimal, well-understood HTTP framework. Controllers, models, and routes are separated for clarity.
- **JWT authentication** keeps the backend stateless. Tokens are stored in `localStorage` on the frontend and sent via the `Authorization: Bearer` header.
- **Cookie-based filter persistence** uses `js-cookie` to save the user's last selected filters (date range, age group, gender). On page refresh, `usePersistedFilters` reads them back so the dashboard restores the previous view.
- **Recharts** was selected for charting because it integrates natively with React and supports click events on individual bars/lines, which is essential for the "click a bar to drill into a line chart" interaction.
- **Tailwind CSS v4** with CSS custom properties provides a dark-mode-ready design system with minimal custom CSS.

## Scaling to 1 Million Write-Events Per Minute

If this dashboard needed to handle 1 million write-events per minute, the single-Express-server-to-PostgreSQL architecture would not suffice. I would introduce a message queue (e.g., Apache Kafka or Amazon SQS) between the API layer and the database so that incoming `POST /track` requests are acknowledged immediately and events are buffered in the queue. A pool of consumer workers would batch-insert events into the database in bulk (e.g., 1,000 rows per INSERT), dramatically reducing per-row overhead. The database itself would be partitioned by timestamp (e.g., daily partitions) to keep write and query performance stable as data grows. For the read path (analytics aggregations), I would layer a time-series-optimized store such as TimescaleDB or pre-compute rollups into a materialized-view table refreshed on a schedule, so that dashboard queries hit pre-aggregated data instead of scanning raw events. Horizontally, the API layer would run behind a load balancer with auto-scaling, and the database would use read replicas for analytics queries to isolate read traffic from write traffic.
