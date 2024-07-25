let fps = 60;
let scrollSpeed = 3; // Adjust as needed (higher values for faster scroll)

const playfield = document.querySelector("div.playfield") as HTMLDivElement;
const main = playfield.querySelector("div.main") as HTMLDivElement;
const notes = main.querySelector("div.notes") as HTMLDivElement;

export async function MoveNoteFromUpToDown(note: HTMLDivElement) {
  const interval = 1000 / fps; // Calculate interval in milliseconds based on fps
  const totalSteps = 600; // Total number of animation steps

  for (let step = 0; step <= totalSteps; step++) {
    const moveDistance = ((step * scrollSpeed) / totalSteps) * 100; // Calculate move distance as a percentage

    if (moveDistance > 100) return;

    note.style.top = `${moveDistance}%`; // Update position based on move distance

    await new Promise<void>((resolve) => {
      setTimeout(resolve, interval); // Wait for the interval before proceeding to the next step
    });
  }
}

export function SpawnNote(lane: number, width: number) {
  const note = document.createElement("div");
  note.className = `note`;
  note.style.setProperty("--lane", `${lane}`);

  //   "Stupidity that causes rendering error" preventation
  if (width > 3) width = 3;

  if (lane == 11 && width == 3) width = 2;
  if (lane == 12) width = 1;

  //   Continue

  note.style.setProperty("--width", `${width}`);
  notes.appendChild(note);

  //   Destroy self when reached the end
  function checkPosition() {
    if (parseInt(note.style.top) >= 100) {
      notes.removeChild(note);
    } else {
      requestAnimationFrame(checkPosition);
    }
  }

  requestAnimationFrame(checkPosition);

  //   Movement
  MoveNoteFromUpToDown(note);
}
