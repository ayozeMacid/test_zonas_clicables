import { Coords } from "./Coords";

export type Square = Record<"origin" | "destination", Coords>;

export type Zone = Square & { url: string; id: symbol };
