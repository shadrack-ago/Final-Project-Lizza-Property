# Lizza Properties

A real estate marketplace for the Kenyan market.

## Backend Setup
1. Copy `.env.example` to `.env` in the `backend/` folder and fill in your MongoDB connection string and JWT secret.
2. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
3. Start the backend server:
   ```sh
   npm start
   ```

## Frontend Setup
1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Update `src/firebase.js` with your Firebase config if needed.
3. Start the frontend:
   ```sh
   npm run dev
   ```

## Environment Variables
- `MONGO` (MongoDB connection string)
- `JWT_SECRET` (JWT secret for authentication)

## Firebase
- Uses Firebase for authentication and analytics. Update `frontend/src/firebase.js` with your Firebase project config if you change it.

---

Site deployed at: [http://final-project-lizza-property-7t0x3pj7d-shadrackagos-projects.vercel.app/]

Pitch Deck: [https://gamma.app/docs/Rental-Property-Finder-Web-App-Pitch-Deck-mw1mhocnay8fnel]


For any issues, please contact the maintainer. 
