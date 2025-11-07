import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import operatorRouter from "./routes/operator_route";
import machineRouter from "./routes/machine_route";
import voteRouter from "./routes/vote_router";
import permitRouter from "./routes/permit_router";
import authRouter from "./routes/auth_router";

/*
 * 1. Auth router
 *       Role based login (Admin, Operator, Machine)
 */

/*
 * 2. Machine router
 *       Create Machine,
 *       Delete Machine,
 */

/*
 * 3. Operator router
 *       Create Operator,
 *       Delete Operator,
 */

/*
 * 4. Permit router
 *       Issue Permit,
 *       Get Permit,
 */

/*
 * 5. Vote router
 *       Cast Vote,
 *       Get Tallies,
 */

const apiV1 = "/api/v1";

const app = express();
app.use(express.json());
// Optional: for form submissions
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads/user_images", express.static("uploads/user_images"));

//Routes
app.use(`${apiV1}/auth`, authRouter);
app.use(`${apiV1}/opertor`, operatorRouter);
app.use(`${apiV1}/machine`, machineRouter);
app.use(`${apiV1}/vote`, voteRouter);
app.use(`${apiV1}/permit`, permitRouter);

app.use(errorHandler);

export default app;
