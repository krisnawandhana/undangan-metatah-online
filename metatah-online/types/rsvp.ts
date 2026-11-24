export type Attendance = "hadir" | "tidak_hadir";

export type Wish = {
  id: string;
  name: string;
  attendance: Attendance;
  guests: number | null;
  message: string;
  /** ISO timestamp */
  createdAt: string;
};

export type RsvpInput = {
  name: string;
  attendance: Attendance | "";
  guests: string;
  message: string;
};

export type RsvpField = keyof RsvpInput;

export type RsvpErrors = Partial<Record<RsvpField, string>>;
