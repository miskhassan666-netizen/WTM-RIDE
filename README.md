# WTM RIDE - Ride Sharing Application

A complete ride-sharing platform with Admin Panel, Driver App, and Rider App built with Node.js, Express, MongoDB, and Flutter.

## Features

### Admin Panel
- User Management (Riders & Drivers)
- Pricing Configuration by City
- Ride History with Filters
- Discount Codes Management
- Wallet Management
- Recharge Requests
- Notifications
- Support Settings
- Charity Box Configuration
- Ratings & Reviews
- Settings & Admin Management

### Driver App
- Driver Registration & Approval
- Real-time Location Tracking
- Ride Acceptance/Rejection
- Google Maps Integration
- Rating System
- Wallet Management
- Support Contact

### Rider App
- Rider Registration
- Ride Booking
- Payment Options (Cash/Wallet)
- Discount Code Application
- Real-time Tracking
- Driver Rating
- Ride History
- Support Contact

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Local)
- **Frontend**: Flutter (Cross-platform)
- **Maps**: Google Maps API (Integrated)
- **Notifications**: Local System (Firebase ready)

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (Local)
- Flutter SDK
- Git

### Setup

1. Clone the repository
```bash
git clone https://github.com/miskhassan666-netizen/WTM-RIDE.git
cd WTM-RIDE
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Start MongoDB (Local)
```bash
mongod
```

4. Run Backend Server
```bash
npm start
```
Backend will run on `http://localhost:5000`

5. Setup Flutter Apps
```bash
cd ../admin_app
flutter pub get
flutter run
```

## Cities
- Amman (عمّان)
- Zarqa (الزرقاء)
- Irbid (أربد)

## Default Admin Credentials
- **Phone**: 0790000000
- **Password**: 123456

## Currency
- **JOD (Jordanian Dinar)**

## Project Structure

```
WTM-RIDE/
├── backend/              # Node.js Backend
├── admin_app/            # Admin Flutter App
├── rider_app/            # Rider Flutter App
├── driver_app/           # Driver Flutter App
└── README.md
```

## License
MIT
