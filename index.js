import { cursorTo, moveCursor } from "node:readline";
import path from "node:path";
import { createWriteStream } from 'fs';
import ytdl from 'ytdl-core';
import { askForVideo, askFormats, grabVidDetails, selectFormat } from './lib.js';
import url from "node:url";
import fs from "node:fs";
const filePath = url.fileURLToPath(import.meta.url);
const dirName = path.dirname(filePath);
const answer = await askForVideo();
const formatAnswer = await askFormats();
const video = await grabVidDetails(answer);
const formats = ytdl.filterFormats(video.formats, formatAnswer);
const selectedFormat = await selectFormat(formats);
downloadVideo(video.videoDetails, selectedFormat);
function downloadVideo(vidDeets, qual) {
    const vUrl = vidDeets.video_url;
    const vName = vidDeets.title;
    const output = path.resolve(dirName, `videos/${vName}.mp4`);
    // If directory doesn't exist, create it
    if (!fs.existsSync(path.resolve(dirName, 'videos'))) {
        fs.mkdirSync(path.resolve(dirName, 'videos'));
    }
    const video = ytdl(vUrl, {
        quality: qual
    });
    let starttime;
    video.pipe(createWriteStream(output));
    video.once('response', () => {
        starttime = Date.now();
    });
    video.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
        const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
        cursorTo(process.stdout, 0);
        process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
        process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
        process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)} minutes`);
        process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)} minutes `);
        moveCursor(process.stdout, 0, -1);
    });
    video.on('end', () => {
        process.stdout.write('\n\n');
        process.exit(1);
    });
}
