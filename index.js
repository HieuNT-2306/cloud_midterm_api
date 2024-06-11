import express from 'express';
import bodyParser from 'body-parser';
import promBundle from 'express-prom-bundle';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import clientRoutes from './routes/client.js';
import authRoutes from './routes/auth.js';
import limiter from './helper/rateLimit.js';


dotenv.config();
const app = express();
const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    metrics: {
      enabled: true,
      prefix: 'api_'
    }
  });
  
app.use(metricsMiddleware);
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
const CLIENT_URL = process.env.CLIENT_URL;
app.use(cors({credentials: true, origin: CLIENT_URL}));
//app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(limiter);

// Routes
app.use("/user", clientRoutes);
app.use("/auth", authRoutes);

export default app;
