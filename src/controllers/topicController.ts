import type { NextFunction, Request, Response } from "express";
import { topicService } from "../services/TopicService.ts";

export const topicController = {
    async add(req: Request, res: Response, nest: NextFunction) {
        const { name } = req.body;

        await topicService.add(name);
        return res.status(200).json({ status: "ok" });
    },

    async getAll(req: Request, res: Response, nest: NextFunction) {
        const topics = await topicService.getAll();
        return res.status(200).json(JSON.stringify(topics));
    },

    async remove(req: Request, res: Response, nest: NextFunction) {
        const { name } = req.body;

        await topicService.remove(name);
        return res.status(200).json({ status: "ok" });
    }
}