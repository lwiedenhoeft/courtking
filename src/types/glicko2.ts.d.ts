declare module "glicko2.ts" {
  export class Player {
    constructor(rating?: number, rd?: number, vol?: number);
    getRating(): number;
    getRd(): number;
    getVol(): number;
  }

  export interface Glicko2Options {
    tau?: number;
    rating?: number;
    rd?: number;
    vol?: number;
  }

  export class Glicko2 {
    constructor(options?: Glicko2Options);
    makePlayer(rating?: number, rd?: number, vol?: number): Player;
    updateRatings(matches: [Player, Player, number][]): void;
  }
}
