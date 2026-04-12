import { SourceData, type CreateEntityDto } from "../types/index.ts";
import { QueueJob } from "../types/queueTypes.ts"
import { entryService } from "./entryService.ts";
import { llmService } from "./LLMService.ts";
import { reelService } from "./reelService.ts";
import { topicService } from "./TopicService.ts";

export const jobQueue: Array<QueueJob> = [];
let isProcessing: boolean = false;

async function processQueue() {
    if (jobQueue.length < 1) return;
    isProcessing = true;
    const job = jobQueue[0]!;

    job.nextStep();
    const topics = await topicService.getAll();
    const description = await reelService.getDescription(job.url);
    
    job.nextStep();
    const transcription = await reelService.getTranscription(job.url);

    job.nextStep();
    const dto = await llmService.processInformation(description, topics, transcription);
    dto.source = new SourceData(job.url, description, transcription);

    job.nextStep();
    await entryService.add(dto);
    
    job.nextStep();
    jobQueue.shift();

    isProcessing = false;
    processQueue();
}

export const queueService = {
    async addJob(url: string) {
        let newJob = new QueueJob(url);

        jobQueue.push(newJob);
        newJob.nextStep();

        if (!isProcessing) processQueue();
    }
}