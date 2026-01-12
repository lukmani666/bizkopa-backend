import cors from 'cors';
import express, { Application } from "express";
import cookieParser from 'cookie-parser';
import routes from './routes'
import { errorHandler } from './middlewares/error.middleware';
import { setupSwagger } from "./swagger";

const app: Application = express();

const allowedOrigins = process.env.CLIENT_ORIGINS?.split(',') ?? [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server / Postman requests
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', routes);
setupSwagger(app);
app.use(errorHandler);

export default app;