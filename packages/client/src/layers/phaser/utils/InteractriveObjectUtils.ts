export enum InteractiveEvent {
  OpenPortal,
}

export const InteractiveTiles = [
  { x: 5, y: 5, event: InteractiveEvent.OpenPortal },
];

export function getInteractiveTile(x: number, y: number) {
  return InteractiveTiles.find((tile) => tile.x === x && tile.y === y);
}
