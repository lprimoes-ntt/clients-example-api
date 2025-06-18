# Clients Example API

A modern, high-performance REST API built with **Bun** and **ElysiaJS** for managing client data.
This project serves as an example API for intern training exercises, demonstrating best practices in API development, database management, and deployment.

Right now it's preppared for Fly.io deployment using a local SQLite database.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Framework**: [ElysiaJS](https://elysiajs.com/) - Fast, type-safe web framework
- **Database**: [SQLite](https://www.sqlite.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Deployment**: [Fly.io](https://fly.io/) with Docker
- **Code Quality**: [Biome](https://biomejs.dev/) for linting and formatting

## 🏗️ Project Structure

```
clients-example-api/
├── src/
│   ├── db/
│   │   ├── context.ts      # Database connection and context
│   │   ├── schema.ts       # Database schema definitions
│   │   └── seed.ts         # Database seeding script
│   ├── endpoints/
│   │   ├── create.ts       # POST /api/clients
│   │   ├── delete.ts       # DELETE /api/clients/:id
│   │   ├── getById.ts      # GET /api/clients/:id
│   │   ├── search.ts       # GET /api/clients
│   │   └── update.ts       # PUT /api/clients/:id
│   ├── plugins.ts          # CORS and Swagger plugins
│   ├── env.ts              # Environment configuration
│   └── index.ts            # Main application entry point
├── Dockerfile              # Docker configuration
├── fly.toml                # Fly.io deployment config
├── drizzle.config.ts       # Drizzle ORM configuration
└── package.json            # Dependencies and scripts
```

## 🗄️ Database Schema

The API uses a SQLite database with the following client table structure:

```sql
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupId INTEGER NOT NULL,
  name TEXT NOT NULL,
  contactEmail TEXT NOT NULL,
  revenue REAL NOT NULL,
  startDate INTEGER NOT NULL
);

CREATE INDEX idx_clients_group_id ON clients(groupId);
```

### Client Model

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | Integer | Auto-incrementing primary key | - |
| `groupId` | Integer | Multi-tenant group identifier | Required, min: 1 |
| `name` | String | Client company name | Required, 1-255 chars |
| `contactEmail` | String | Contact email address | Required, valid email format |
| `revenue` | Float | Annual revenue | Required, min: 1 |
| `startDate` | Date | Client relationship start date | Required, valid date |

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.2.16 or higher)
- [Node.js](https://nodejs.org/) for development tools (drizzle-kit does not support Bun at the moment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clients-example-api
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up the database**
   ```bash
   bun run seed
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Once the server is running, visit `http://localhost:3000/swagger` to access the interactive Swagger documentation.

### Multi-tenant data isolation

All endpoints require a `x-group-id` header for multi-tenant data isolation. For example:
```
x-group-id: 25
```

## 🔧 Development

### Available Scripts

```bash
# Start development server with hot reload
bun run dev

# Seed database with sample data
bun run seed

# Start production server (for Fly.io deployment)
bun run fly:start
```

## 🐳 Docker Deployment

### Fly.io Deployment

The project is configured for deployment on Fly.io:

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   fly auth login
   ```

3. **Deploy the application**
   ```bash
   fly deploy
   ```

The application will be available at `https://clients-example-api.fly.dev`

## 🧪 Testing

### Database Seeding

The application includes a comprehensive seeding script that creates:
- 30 groups
- 50 clients per group (1,500 total clients)
- Realistic data using Faker.js

```bash
bun run seed
```

### Sample Data

The seeded data includes:
- Company names from various industries
- Valid email addresses
- Revenue ranging from $1,000 to $1,000,000
- Start dates from the past 5 years

## 🔒 Security Features

- **Input Validation**: All requests are validated using TypeBox schemas
- **SQL Injection Protection**: Drizzle ORM provides parameterized queries
- **CORS Configuration**: Properly configured for cross-origin requests
- **Error Handling**: Structured error responses without sensitive information
- **Multi-tenancy**: Data isolation through group-based filtering

## 📊 Performance

- **Fast Startup**: Bun runtime provides rapid application startup
- **Efficient Queries**: Optimized database queries with proper indexing
- **Memory Efficient**: SQLite database with minimal memory footprint
- **Scalable**: Designed for horizontal scaling with proper data isolation

## 📝 License

This project has an MIT license and is created for educational purposes as part of an intern training program.

---

**Built with ❤️ using Bun and ElysiaJS**
