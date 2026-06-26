# Installation & Setup Guide

## Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env File**
   ```bash
   cp .env.example .env
   ```

3. **Start MongoDB (Local)**
   ```bash
   mongod
   ```

4. **Run Backend Server**
   ```bash
   npm start
   # or with nodemon for development
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

## Admin App Setup

1. **Get Dependencies**
   ```bash
   cd admin_app
   flutter pub get
   ```

2. **Run App**
   ```bash
   flutter run
   # or specify device
   flutter run -d chrome
   ```

3. **Login with Default Credentials**
   - Phone: `0790000000`
   - Password: `123456`

## Rider App Setup

1. **Get Dependencies**
   ```bash
   cd rider_app
   flutter pub get
   ```

2. **Run App**
   ```bash
   flutter run
   ```

3. **Register or Login**
   - Create new account or login with existing credentials

## Driver App Setup

1. **Get Dependencies**
   ```bash
   cd driver_app
   flutter pub get
   ```

2. **Run App**
   ```bash
   flutter run
   ```

3. **Register as Driver**
   - Register with vehicle details
   - Wait for admin approval
   - Then access driver features

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/login` - Admin Login
- `POST /api/auth/register` - Admin Register
- `POST /api/users/rider/login` - Rider Login
- `POST /api/users/rider/register` - Rider Register
- `POST /api/drivers/login` - Driver Login
- `POST /api/drivers/register` - Driver Register

### Admin Routes
- `GET /api/admin/riders` - Get all riders
- `GET /api/admin/riders/:id` - Get rider details
- `POST /api/admin/riders/:id/add-credit` - Add credit to rider
- `GET /api/admin/drivers` - Get all drivers
- `GET /api/admin/drivers/pending/requests` - Get pending driver requests
- `POST /api/admin/drivers/:id/approve` - Approve driver
- `POST /api/admin/drivers/:id/reject` - Reject driver
- `GET /api/admin/rides` - Get rides with filters
- `GET /api/admin/rides/:id` - Get ride details
- `GET /api/admin/pricing/:city` - Get pricing for city
- `POST /api/admin/pricing/:city` - Update pricing
- `POST /api/admin/discounts` - Create discount
- `GET /api/admin/discounts` - Get all discounts
- `PUT /api/admin/discounts/:id` - Update discount
- `GET /api/admin/recharge-requests` - Get recharge requests
- `POST /api/admin/recharge-requests/:id/approve` - Approve recharge request
- `POST /api/admin/notifications/send` - Send notification
- `GET /api/admin/support` - Get support settings
- `POST /api/admin/support` - Update support settings
- `GET /api/admin/charity` - Get charity box
- `POST /api/admin/charity` - Update charity settings
- `GET /api/admin/stats` - Get dashboard stats

### Ride Routes
- `POST /api/rides/request` - Request a ride
- `POST /api/rides/:id/accept` - Accept ride (driver)
- `POST /api/rides/:id/start` - Start ride
- `POST /api/rides/:id/complete` - Complete ride
- `POST /api/rides/:id/cancel` - Cancel ride
- `GET /api/rides/:id` - Get ride details
- `GET /api/rides/history/rider` - Rider ride history
- `GET /api/rides/history/driver` - Driver ride history

### Wallet Routes
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet/transactions` - Get transactions

### Rating Routes
- `POST /api/ratings` - Submit rating

### Notification Routes
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/:id/read` - Mark as read

---

## Default Admin Credentials
- **Phone:** 0790000000
- **Password:** 123456

## Currency
- **JOD (Jordanian Dinar)**

## Cities Supported
- Amman (عمّان)
- Zarqa (الزرقاء)
- Irbid (أربد)

## Technology Stack

- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Local)
- **Frontend:** Flutter (Cross-platform)
- **Real-time:** Socket.IO
- **Maps:** Google Maps API (Ready for integration)
- **Authentication:** JWT

---

## Project Structure

```
WTM-RIDE/
├── backend/
│   ├── models/        # MongoDB Schemas
│   ├── routes/        # API Routes
│   ├── middleware/    # Authentication & Middleware
│   ├── server.js      # Main Server
│   ├── package.json
│   └── .env.example
├── admin_app/         # Admin Flutter App
│   ├── lib/
│   │   ├── screens/   # UI Screens
│   │   ├── providers/ # State Management
│   │   └── main.dart
│   └── pubspec.yaml
├── rider_app/         # Rider Flutter App
│   ├── lib/
│   │   ├── screens/
│   │   ├── providers/
│   │   └── main.dart
│   └── pubspec.yaml
├── driver_app/        # Driver Flutter App
│   ├── lib/
│   │   ├── screens/
│   │   ├── providers/
│   │   └── main.dart
│   └── pubspec.yaml
└── README.md
```

---

## Features Implemented

### ✅ Complete
- Admin authentication and dashboard
- Rider/Driver registration and login
- Pricing management by city
- Discount code system
- Wallet and recharge system
- Ride request and booking
- Driver approval workflow
- Notification system
- Rating system
- Charity box configuration
- Support settings management

### 🔄 Real-time (Socket.IO Ready)
- Live location tracking
- Ride acceptance notifications
- Driver-Rider communication
- Order matching algorithm

### 🚀 Performance
- Lightweight UI with minimal animations
- Efficient database queries with filters
- Local caching for offline support
- Optimized API responses

---

## Support

For issues or questions, refer to the API documentation in the README or contact support.

**Happy Coding! 🎉**
