import { BeatmapNote } from "./BeatmapJSON";
import { SpawnNote } from "./RenderNote";

export class NoteScheduler {
  private notes: BeatmapNote[] = [];
  private startTime: number | null = null;

  constructor(notes: BeatmapNote[]) {
    this.notes = notes;
  }

  start() {
    this.startTime = Date.now();
    this.scheduleNotes();
  }

  private scheduleNotes() {
    if (this.startTime === null) {
      console.error("Scheduler has not started.");
      return;
    }

    this.notes.forEach((note) => {
      const noteTime = note.time; //(Seconds)
      // @ts-expect-error
      const currentTime = (Date.now() - this.startTime) / 1000;

      const delay = (noteTime - currentTime) * 1000;

      if (delay > 0) {
        setTimeout(() => {
          SpawnNote(note.lane, note.width);
        }, delay);
      }
    });
  }
}
