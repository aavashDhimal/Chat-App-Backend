import { app } from "./app";
import swaggerUi from "swagger-ui-express";
import schema from "./apiDocs/schema.json";
import { json } from "express";

// serve Swagger UI using the JSON file
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(schema));

app.get("/swagger", (_req, res) => {
    res.json(schema,);
    res.json(schema);
});