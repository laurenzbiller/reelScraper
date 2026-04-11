import type { Request, Response, NextFunction } from 'express'
import { topicService } from '../services/TopicService.ts';
import { llmService } from '../services/LLMService.ts';
import { reelService } from '../services/reelService.ts';
import type { CreateEntityDto } from '../types/index.ts';
import { entryService } from '../services/entryService.ts';

export const reelController = {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { url } = req.body;

            const topics = await topicService.getAll();
            // const description = await reelService.getDescription(url);
            const transcription = await reelService.getTranscription(url);

            const dto: CreateEntityDto = await llmService.processInformation("", topics, transcription);
            // dto.source.rawDescription = description;
            // dto.source.rawTranscription = transcription;
 
            await entryService.add(dto);
            return res.status(200).json({ status: "ok" });
        } catch (err) {
            next(err);
        }
    }
}