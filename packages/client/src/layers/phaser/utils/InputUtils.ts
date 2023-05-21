import { Animations } from "../constants";

export function getMovementAction(keyCode: number) {
  switch (keyCode) {
    case 37: // LEFT
      return {
        animation: Animations.PepeLeft,
        x: -1,
        y: 0,
      };
    case 38: // UP
      return {
        animation: Animations.PepeUp,
        x: 0,
        y: -1,
      };
    case 39: // RIGHT
      return {
        animation: Animations.PepeRight,
        x: 1,
        y: 0,
      };
    case 40: // DOWN
      return {
        animation: Animations.PepeDown,
        x: 0,
        y: 1,
      };
  }
}
