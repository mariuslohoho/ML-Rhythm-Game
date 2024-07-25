export interface BeatmapJSON {
  BeatmapJSON_Version: string;
  Track_Details: TrackDetails;
  Track_Gameplay: TrackGameplay;
}

export interface TrackDetails {
  Track_Name: string;
  Track_Artist: string;
  Track_Description: string;
  Track_Mapper: string;
  Track_Version: string;
  Track_BPM: string;
  Track_Difficulty: string;
}

export interface TrackGameplay {
  Audio: Audio;
  Beatmap_Notes: BeatmapNote[];
}

export interface Audio {
  type: string;
  url: string;
}

export interface BeatmapNote {
  time: number;
  lane: number;
  width: number;
  type: string;
}
