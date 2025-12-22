import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectMongo from './config/mongo';
// import { initRedis } from './config/redis';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectMongo();
    // await initRedis();

    app.listen(PORT, () => {
      console.log(`BIZKOPA API running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();