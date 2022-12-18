export interface Festival {
  name?: string;
  bands: Band[];
}

export interface Band {
  name: string;
  recordLabel?: string;
}
