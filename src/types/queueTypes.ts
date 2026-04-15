import { randomUUID } from "crypto";
import { broadcastStateChange } from "../services/websocketService.ts";

export class QueueJob {
    url: string;
    state: JobState;
    id: string;

    constructor(url: string) {
        this.url = url;
        this.state = JOB_STATES[0];
        this.id = randomUUID();
    }

    /**
     * nextStep
     */
    public nextStep() {
        const currentIndex = JOB_STATES.indexOf(this.state);
        if (currentIndex + 1 >= 7) return;
        this.state = JOB_STATES[currentIndex + 1]!;
        broadcastStateChange();

        if (this.state == JOB_STATES[6]) {
            // Keep the Done state for 2 seconds and then send another State Change to remove it
            setTimeout(() => broadcastStateChange(), 3000);
        }
    }

    /**
     * error
     */
    public error(error: any) {
        console.log(error);
        this.state = JOB_STATES[7];
        broadcastStateChange();
        // Keep the Done state for 2 seconds and then send another State Change to remove it
        setTimeout(() => broadcastStateChange(), 3000);
    }
}

const JOB_STATES = [
    "CREATED",
    "IN_QUEUE",
    "GET_DESCRIPTION",
    "GET_TRANSCRIPTION",
    "PROCESS_INFORMATION",
    "STORE_IN_DB",
    "DONE",
    "ERROR",
] as const;

export type JobState = typeof JOB_STATES[number];