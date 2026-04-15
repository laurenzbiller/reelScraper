import { QueueJob } from "../types/queueTypes.ts"
import { entryService, type CreateEntryDto } from "./entryService.ts";
import { llmService } from "./llmService.ts";
import { reelService } from "./reelService.ts";
import { topicService } from "./topicService.ts";
import type { SourceData } from "../db/schema.ts";

export const jobQueue: Array<QueueJob> = [];
let isProcessing: boolean = false;

async function processQueue() {
    if (jobQueue.length < 1) return;
    isProcessing = true;
    const job = jobQueue[0]!;

    try {
        job.nextStep();
        const topics = await topicService.getAll();
        const description = await reelService.getDescription(job.url);

        job.nextStep();
        const transcription = await reelService.getTranscription(job.url);

        job.nextStep();
        const dto: CreateEntryDto = await llmService.processInformation(description, topics, transcription);
        dto.source = { url: job.url, rawDescription: description, rawTranscription: transcription };

        job.nextStep();
        await entryService.add(dto);

        job.nextStep();
    } catch (err) {
        job.error(err)
    } finally {
        jobQueue.shift();
        isProcessing = false;
        processQueue();
    }
}

export const queueService = {
    async addJob(url: string) {
        let newJob = new QueueJob(url);

        jobQueue.push(newJob);
        newJob.nextStep();

        if (!isProcessing) processQueue();
    }
}