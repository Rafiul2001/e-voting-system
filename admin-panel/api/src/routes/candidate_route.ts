import { Request, Response, Router } from "express";

const candidateRouter = Router();

candidateRouter.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Candidate Route"
    })
});
