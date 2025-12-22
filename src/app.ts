import express, { Application } from "express";
import routes from './routes'
// import { errorHandler } from './middlewares/error.middleware';
import { setupSwagger } from "./swagger";

const app: Application = express();

app.use(express.json());
app.use('/api', routes);
setupSwagger(app);
// app.use(errorHandler);

export default app;