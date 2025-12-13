import {app} from "./app";
import swaggerUi from "swagger-ui-express";
import auth from "./apiDocs/auth.json";

// serve Swagger UI using the JSON file
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(auth));

// optional: raw json endpoint
app.get("/swagger", (_req, res) => {
    res.json(auth);
});