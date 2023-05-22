export enum InteractiveEvent {
  OpenPortal,
  StartMining,
}

export const InteractiveTiles = [
  { x: 28, y: 29, width: 2, height: 2, event: InteractiveEvent.StartMining },
];

export function getInteractiveTile(x: number, y: number) {
  return InteractiveTiles.find(
    (tile) =>
      tile.x >= x &&
      tile.x + tile.width <= x &&
      tile.y >= y &&
      tile.y + tile.height <= y
  );
}
