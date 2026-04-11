import type { NextFunction, Request, Response } from "express";
import { entryService } from "../services/entryService.ts";
import { topicService } from "../services/topicService.ts";

export const entryController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const entries = await entryService.getAll();
            const topics = await topicService.getAll();
            return res.json({entries, topics});
        } catch (err) {
            next(err);
        }
    }
}