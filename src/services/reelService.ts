import ffmpeg from "fluent-ffmpeg";
import { spawn } from "child_process";
import { llmService } from "./LLMService.ts";
import { deleteFile } from "../utils.ts";

import path from "path";
const OUTPUT_VIDEO_PATH = path.resolve(".tmp/video.mp4");
const OUTPUT_AUDIO_PATH = path.resolve(".tmp/audio.mp3");

export const reelService = {
    async getDescription(url: string): Promise<string> {
        const endpoint = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}`;

        const res = await fetch(endpoint, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();
        return data.title;
    },

    async getTranscription(url: string): Promise<string> {
        const videoPath = await donwloadVideo(url);
        await extractAudio(videoPath);
        const transcript = await llmService.transcribeWhisper(OUTPUT_AUDIO_PATH);

        // Async Delete
        deleteFile(OUTPUT_AUDIO_PATH);
        deleteFile(OUTPUT_VIDEO_PATH);

        return transcript;
    }
}

async function extractAudio(videoPath: string) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .noVideo()
            .audioChannels(1)
            .save(OUTPUT_AUDIO_PATH)
            .on("end", resolve)
            .on("error", reject);
    });
}

async function donwloadVideo(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const ytdlp = spawn("yt-dlp", [
            url,
            "-o", OUTPUT_VIDEO_PATH,
            "-f", "mp4"
        ]);

        ytdlp.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });

        ytdlp.stderr.on("data", (data) => {
            console.log(`stderr: ${data}`);
        });

        ytdlp.on("close", (code) => {
            if (code === 0) {
                resolve(OUTPUT_VIDEO_PATH);
            } else {
                reject(new Error(`yt-dlp exited with code ${code}`));
            }
        });
    });
}