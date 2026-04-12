import type { Request, Response, NextFunction } from 'express'
import { topicService } from '../services/TopicService.ts';
import { llmService } from '../services/LLMService.ts';
import { reelService } from '../services/reelService.ts';
import type { CreateEntityDto } from '../types/index.ts';
import { entryService } from '../services/entryService.ts';
import { queueService } from '../services/queueService.ts';

export const reelController = {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { url } = req.body;

            queueService.addJob(url);
            return res.status(200).json({ status: "ok" });
        } catch (err) {
            next(err);
        }
    }
}