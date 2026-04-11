import ffmpeg from "fluent-ffmpeg";
import { spawn } from "child_process";
import { llmService } from "./LLMService.ts";

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
        return llmService.transcribeWhisper(OUTPUT_AUDIO_PATH);
    }
}

const OUTPUT_VIDEO_PATH = "/Users/lbiller/Desktop/Neuer Ordner/reel.mp4";
const OUTPUT_AUDIO_PATH = "/Users/lbiller/Desktop/Neuer Ordner/audio.mp3";

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
                resolve("/Users/lbiller/Desktop/Neuer Ordner/reel.mp4");
            } else {
                reject(new Error(`yt-dlp exited with code ${code}`));
            }
        });
    });
}