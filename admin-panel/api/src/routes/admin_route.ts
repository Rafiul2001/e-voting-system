import { Request, Response, Router } from "express";

const adminRouter = Router()

adminRouter.get("/", (req: Request, res: Response)=> {
    res.json({
        message: "Admin Route"
    });
});

export default adminRouter