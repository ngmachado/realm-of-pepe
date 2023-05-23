export enum InteractiveEvent {
  StartMining,
  StartExchange,
  MintNFT,
  EnterCave,
}

export const InteractiveTiles = [
  { x: 27, y: 27, width: 3, height: 2, event: InteractiveEvent.StartMining },
  { x: 26, y: 11, width: 4, height: 3, event: InteractiveEvent.StartExchange },
  { x: 44, y: 16, width: 4, height: 3, event: InteractiveEvent.MintNFT },
  { x: 3, y: 13, width: 3, height: 2, event: InteractiveEvent.EnterCave }
];

export function getInteractiveTile(x: number, y: number) {
  return InteractiveTiles.find(
    (tile) =>
      tile.x <= x &&
      tile.x + tile.width >= x &&
      tile.y <= y &&
      tile.y + tile.height >= y
  );
}

export function getTilesToInteractWith(x: number, y: number) {
  return InteractiveTiles.filter(
    (tile) =>
      tile.x <= x &&
      tile.x + tile.width >= x &&
      tile.y <= y &&
      tile.y + tile.height >= y
  );
}
