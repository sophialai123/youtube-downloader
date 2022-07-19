import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import ytdl from 'ytdl-core';

const sess = readline.createInterface({ input, output });

export async function askForVideo() {
  const answer = await sess.question("Please provide the URL for the video you'd like to download: ");
  if (ytdl.validateURL(answer)) {
    return answer
  }  else {
    console.log("Please provide a valid YouTube url")
  }
}

export async function askFormats() {
  const askQuestion = `
  What formats did you want to see?
  1: Video & Audio
  2: Audio
  3: Video
  `
  const answer = await sess.question(askQuestion)
  return answer
}

export async function findCompatFormats(formats, type=1) {
  let filtFormats;
  switch (type) {
    case 1:
      filtFormats = formats.filter((val) => val.hasAudio && val.hasVideo)
    case 2:
      filtFormats = formats.filter((val) => val.hasAudio)
    case 3:
      filtFormats = formats.filter((val) => val.hasVideo)
    default:
      break;
  }

  // TODO: Ask user which format specifically
}


export async function grabVidDetails(url) {
  ytdl.getInfo(url).then((data => {
    const videoName = data.videoDetails.title
    console.log("Found video: ", videoName)
    return data
  }))
}
