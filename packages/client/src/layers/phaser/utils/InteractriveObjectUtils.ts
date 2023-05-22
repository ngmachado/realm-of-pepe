export enum InteractiveEvent {
  OpenPortal,
  StartMining,
}

export const InteractiveTiles = [
  { x: 5, y: 5, event: InteractiveEvent.OpenPortal },
  { x: 12, y: 27, event: InteractiveEvent.StartMining },
];

export function getInteractiveTile(x: number, y: number) {
  return InteractiveTiles.find((tile) => tile.x === x && tile.y === y);
}
