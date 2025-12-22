import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BIZKOPA Backend API",
      version: "1.0.0",
      description: "API documentation for BIZKOPA backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  }, 
  apis: ["./src/**/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
}
