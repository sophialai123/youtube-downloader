import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import ytdl, { videoFormat } from 'ytdl-core';

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
  What formats did you want to see? (1-3)
  1: Video & Audio
  2: Audio Only
  3: Video Only
  `
  const answer = await sess.question(askQuestion)
  switch (answer) {
    case "1":
      return "videoandaudio"
    case 2:
      return "audioonly"
    case 3:
      return "videoonly"
    default:
      break;
  }
}

export async function selectFormat(formats: videoFormat[]) {
  formats.forEach((val) => {
    sess.write(`${val.itag}: ${val.qualityLabel} | ${val.container}\n`)
  })

  const answer = await sess.question("Which format would you like to download? (Please type the number associated with the format wanted)")
  return answer
}


export async function grabVidDetails(url: string) {
  const info = await ytdl.getInfo(url).then(data => data)
  return info
}
