# 🚛 FleetERP — Delivery Order & Vehicle Movement Software

A full-stack ERP system built for logistics companies to manage delivery orders, track vehicle movements, and generate reports — all in one place.

---

## 📸 Features

- 🔐 **Secure Login** — Session-based authentication with hashed passwords
- 📋 **Delivery Order Entry** — Create, edit, delete and search delivery orders
- 🚛 **Vehicle Movement Tracking** — Track real-time status updates per delivery order
- 📊 **Reports & Analytics** — 6 report types with print and CSV export
- 👥 **Masters Management** — Manage parties, items and custom statuses
- 📈 **Live Dashboard** — KPI cards, recent DOs, movement history

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | .NET 10 Web API (C#) |
| Database | SQL Server |
| Hosting | IIS (Windows Server) |
| Styling | Pure CSS (no UI library) |

---

## 📁 Project Structure

```
FleetERP/
├── FleetERP/                  # .NET Backend
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── DeliveryOrdersController.cs
│   │   ├── ItemsController.cs
│   │   ├── MovementsController.cs
│   │   ├── PartiesController.cs
│   │   └── StatusesController.cs
│   ├── model/
│   │   ├── DeliveryOrder.cs
│   │   ├── Item.cs
│   │   ├── Movement.cs
│   │   ├── Party.cs
│   │   ├── Status.cs
│   │   └── User.cs
│   ├── data/
│   │   └── data.cs            # AppDbContext
│   ├── appsettings.json
│   └── Program.cs
│
└── my-project/                # React Frontend
    └── src/
        ├── components/
        │   ├── dashboard.jsx
        │   ├── doentry.jsx
        │   ├── items.jsx
        │   ├── layout.jsx
        │   ├── loginpagee.jsx
        │   ├── parties.jsx
        │   ├── reports.jsx
        │   ├── statuses.jsx
        │   └── vehiclemovement.jsx
        ├── services/
        │   ├── auth.js
        │   ├── doservice.js
        │   ├── itemservices.js
        │   ├── movementservice.js
        │   ├── partyservice.js
        │   └── statusservice.js
        ├── App.jsx
        ├── auth.js
        └── ProtectedRoute.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [.NET SDK 10](https://dotnet.microsoft.com/)
- SQL Server (local or remote)
- Visual Studio 2022 or VS Code

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/FleetERP.git
cd FleetERP
```

---

### 2. Backend Setup

```bash
cd FleetERP
```

Update `appsettings.json` with your SQL Server connection:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=FleetERP;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
  }
}
```

Run the database migrations:

```bash
dotnet ef database update
```

Or manually create tables in SQL Server:

```sql
CREATE TABLE Parties (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(MAX) NOT NULL,
    Name NVARCHAR(MAX) NOT NULL
);

CREATE TABLE Items (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(MAX) NOT NULL,
    Name NVARCHAR(MAX) NOT NULL
);

CREATE TABLE Statuses (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(MAX) NOT NULL,
    Name NVARCHAR(MAX) NOT NULL
);

CREATE TABLE DeliveryOrders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DoNo NVARCHAR(MAX),
    Date NVARCHAR(MAX),
    SourceParty NVARCHAR(MAX),
    DestParty NVARCHAR(MAX),
    Item NVARCHAR(MAX),
    Weight NVARCHAR(MAX),
    Bags NVARCHAR(MAX),
    VehicleNo NVARCHAR(MAX),
    Freight NVARCHAR(MAX),
    DriverName NVARCHAR(MAX),
    DriverNumber NVARCHAR(MAX)
);

CREATE TABLE Movements (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DoNo NVARCHAR(MAX),
    EntryDateTime NVARCHAR(MAX),
    DriverName NVARCHAR(MAX),
    DriverMobile NVARCHAR(MAX),
    Status NVARCHAR(MAX),
    Remarks NVARCHAR(MAX),
    StatusDateTime NVARCHAR(MAX)
);

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(MAX) NOT NULL,
    Password NVARCHAR(MAX) NOT NULL,
    FullName NVARCHAR(MAX) NOT NULL
);
```

Create the default admin user (password: `Vehicle786`):

```sql
INSERT INTO Users (Username, Password, FullName)
VALUES (
    'admin',
    'qDQv0knfXzjzPkgxBp0m6otOEADWFnzps2A5gCJ2vO0=',
    'Administrator'
);
```

Start the backend:

```bash
dotnet run
# API runs at https://localhost:7047
```

---

### 3. Frontend Setup

```bash
cd my-project
npm install
```

Update the BASE URL in all service files to point to your API:

```javascript
// src/services/partyservice.js (and all other service files)
const BASE = "https://localhost:7047/api";  // local development
// const BASE = "http://YOUR_SERVER_IP:8080/api";  // production
```

Start the frontend:

```bash
npm run dev
# App runs at http://localhost:5173
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/Auth/login` | Login with username/password |

### Delivery Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/DeliveryOrders` | Get all DOs |
| GET | `/api/DeliveryOrders/nextno` | Get next DO number |
| GET | `/api/DeliveryOrders/{doNo}` | Get single DO |
| POST | `/api/DeliveryOrders` | Create new DO |
| PUT | `/api/DeliveryOrders/{doNo}` | Update existing DO |
| DELETE | `/api/DeliveryOrders/{doNo}` | Delete DO |

### Movements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Movements` | Get all movements |
| GET | `/api/Movements/lateststatus` | Get latest status per DO |
| POST | `/api/Movements` | Add movement entry |
| DELETE | `/api/Movements/{id}` | Delete movement |

### Masters (Parties / Items / Statuses)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Parties` | Get all parties |
| POST | `/api/Parties` | Add party |
| PUT | `/api/Parties/{code}` | Update party |
| DELETE | `/api/Parties/{code}` | Delete party |

*(Same pattern for `/api/Items` and `/api/Statuses`)*

---

## 🏗️ Production Deployment (Windows Server + IIS)

### Backend
```
1. Visual Studio → Build → Publish → folder
2. Copy published files to C:\FleetERP\api\
3. Create IIS site "FleetAPI" on port 8080
4. Install ASP.NET Core Hosting Bundle (.NET 10)
5. iisreset
```

### Frontend
```
1. Update all service files: BASE = "http://YOUR_SERVER:8080/api"
2. npm run build
3. Copy dist/ contents to C:\FleetERP\web\
4. Create IIS site "FleetWeb" on port 3000
5. Add web.config for React Router (see below)
6. iisreset
```

### web.config for React Router
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

---

## 🔑 Default Credentials

```
Username: admin
Password: Vehicle786
```

> ⚠️ Change the password after first login in production.

---

## 📊 Reports Available

| Report | Description |
|--------|-------------|
| Daily DO | All delivery orders with filters |
| Pending / Transit | DOs not yet delivered |
| Delivered | Completed deliveries |
| No Movement Yet | DOs with no status update |
| Freight Register | Financial summary with totals |
| Party-wise Ledger | Per-party breakdown |

All reports support:
- 📅 Date range filter
- 🔍 Party name search
- 🖨️ Print (landscape, formatted)
- 📥 CSV Export

---

## 🔧 Changing Admin Password

1. Temporarily add to `AuthController.cs`:
```csharp
[HttpGet("hashme/{password}")]
public IActionResult HashMe(string password) {
    using var sha = System.Security.Cryptography.SHA256.Create();
    var bytes = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
    return Ok(Convert.ToBase64String(bytes));
}
```
2. Visit `https://localhost:7047/api/Auth/hashme/YOURNEWPASSWORD`
3. Copy the hash
4. Run in SQL Server:
```sql
UPDATE Users SET Password = 'PASTE_HASH_HERE' WHERE Username = 'admin';
```
5. **Delete** the `hashme` endpoint immediately after

---

## 📝 License

This project was built as a custom ERP solution for a logistics client.

---

## 👨‍💻 Built By

**Raheel Ahmad** — Built from scratch learning React and .NET along the way.

> *"Every feature in this app was a new lesson."*
