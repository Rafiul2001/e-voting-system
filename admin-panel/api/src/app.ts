import express from "express";
import cors from "cors";
import adminRouter from "./routes/admin_route";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads/user_images", express.static("uploads/user_images"));

//Routes

app.use("/api/v1/admin", adminRouter);

app.use(errorHandler);

export default app;
