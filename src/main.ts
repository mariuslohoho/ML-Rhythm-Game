import { json } from "stream/consumers";
import { BeatmapJSON } from "./BeatmapJSON";
import * as FS from "fs";
const fs: typeof FS = window.require("fs");
import { TrackGameplay, Audio } from "./BeatmapJSON.ts";
import { SpawnNote } from "./RenderNote.ts";
import { NoteScheduler } from "./NoteScheduler.ts";

// const fs = require("fs");

const playfield = document.querySelector("div.playfield") as HTMLDivElement;
const main = playfield.querySelector("div.main") as HTMLDivElement;
const notes = main.querySelector("div.notes") as HTMLDivElement;

function FitPlayfieldWithScreenDimentions() {
  const currentBoundingRect = main.getBoundingClientRect();

  //   Check width size
  const widthOffset = currentBoundingRect.left;

  if (widthOffset > 0) return;

  const newScale = (currentBoundingRect.width + widthOffset * 2) / currentBoundingRect.width - 0.25;
  main.style.setProperty("scale", newScale.toString());

  // Update Touch Detection Plane
  const newBoundingRect = main.querySelector("div.judgement")?.getBoundingClientRect() as DOMRect;
  const touchDetection = document.querySelector("div.touch") as HTMLDivElement;

  touchDetection.style.height = "100vh";
  touchDetection.style.width = `${newBoundingRect.width}px`;
}

FitPlayfieldWithScreenDimentions();

window.addEventListener("resize", () => {
  FitPlayfieldWithScreenDimentions();
});

function RanInt(min: number, max: number) {
  // Generate a random number between min and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnRandomNotes(numNotes: number) {
  for (let i = 0; i < numNotes; i++) {
    SpawnNote(RanInt(1, 12), RanInt(1, 3));
  }
}

function continuouslySpawnNotes(interval: number) {
  setInterval(() => {
    spawnRandomNotes(1); // Spawn 1 random note each interval
  }, interval);
}

// continuouslySpawnNotes(200);

// READ JSON AND PLAY GAME
async function CheckBeatmapJsonFileCompleteness(BMJSON: BeatmapJSON | undefined): Promise<[boolean, string]> {
  if (BMJSON === undefined) return [false, ""];

  if (BMJSON.Track_Gameplay.Audio.type === "file") {
    if (!fs.existsSync(BMJSON.Track_Gameplay.Audio.url) && BMJSON.Track_Gameplay.Audio.url.match(/\.mp3$/)) {
      // Cannot find audio from the path
      return [false, "Cannot locate audio"];
    }
  }

  if (BMJSON.Track_Gameplay.Beatmap_Notes.length === 0) {
    return [false, "Beatmap is empty :skull:"];
  }

  return [true, ""];
}

async function Read(jsonURL: string) {
  const BeatMapJSONObject = (await (await fetch(jsonURL)).json()) as BeatmapJSON;
  console.log(BeatMapJSONObject);

  const [isJSONValid, errorMsg] = await CheckBeatmapJsonFileCompleteness(BeatMapJSONObject);

  if (!isJSONValid) {
    console.error(`The beatmap JSON File is not valid: ${errorMsg}`);
  }

  const NS = new NoteScheduler(BeatMapJSONObject.Track_Gameplay.Beatmap_Notes);

  NS.start();
}

Read("data/beatmaps/NewJeans-HypeBoy.json");
