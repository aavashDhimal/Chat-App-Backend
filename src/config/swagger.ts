import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth API",
            version: "1.0.0",
            description: "API documentation for authentication services"
        },
        servers: [
            {
                url: "http://localhost:4040/api",
                description: "Local server"
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    // Path to route files for annotation
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"]
};

export const swaggerSpec = swaggerJsDoc(options);

export const swaggerDocs = (app: Express): void => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Swagger docs available at /api-docs");
};
