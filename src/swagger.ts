import {app} from "./app";
import swaggerUi from "swagger-ui-express";
import auth from "./apiDocs/auth.json";
import rooms from "./apiDocs/rooms.json";
import { json } from "express";

// serve Swagger UI using the JSON file
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(auth),swaggerUi.setup(rooms));

// optional: raw json endpoint
app.get("/swagger", (_req, res) => {
    res.json(auth,);
    res.json(rooms);
});