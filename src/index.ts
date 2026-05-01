import express from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import apiRouter from './routes';
import path from "path";

dotenv.config();

const app = express();
const environment = process.env.ENVIRONMENT?.trim().toUpperCase();
const PORT = environment === 'PRODUCTION' ? 5000 : 5001;
const frontendUrl = process.env.FRONTEND_URL?.trim();
const localFrontendUrls = (process.env.LOCAL_FRONTEND_URLS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set(
  [
    frontendUrl,
    ...localFrontendUrls,
  ].filter((origin): origin is string => Boolean(origin))
);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests and local frontend origins.
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Serve static files from the assets folder
app.use("/assets", express.static(path.join(__dirname, "../assets")));

app.use(express.json());

app.use('/api', apiRouter);

app.get('/', (_req, res) => {
  res.send('Welcome to UWF Backend V2 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running at ${process.env.API_URL || `http://localhost:${PORT}`}`);
});
