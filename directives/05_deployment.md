# Directive: Deployment

## Frontend → Vercel
1. Push `FrontEnd/` to GitHub
2. Connect repo to Vercel
3. Set root directory: `FrontEnd`
4. Add env var: `VITE_API_URL=https://your-backend.onrender.com`
5. Deploy

## Backend → Render
1. Connect `Backend/` to Render as a Web Service
2. Build command: `npm install`
3. Start command: `npm start`
4. Add env vars:
   - `GEMINI_API_KEY`
   - `FIREBASE_SERVICE_ACCOUNT` (JSON string, base64 encoded)
   - `CORS_ORIGIN=https://your-app.vercel.app`
   - `PORT=10000`

## Firebase Rules (Firestore)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schemes/{scheme} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Edge Cases
- Cold start on Render: free tier sleeps after 15min inactivity
- CORS: always set exact frontend origin, not wildcard in production
- Firebase key: store as env var JSON string, parse with `JSON.parse()`
