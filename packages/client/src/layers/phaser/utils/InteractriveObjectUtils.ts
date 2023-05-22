export enum InteractiveEvent {
  StartMining,
  StartExchange,
  MintNFT,
}

export const InteractiveTiles = [
  { x: 28, y: 29, width: 2, height: 2, event: InteractiveEvent.StartMining },
  { x: 28, y: 11, width: 2, height: 2, event: InteractiveEvent.StartExchange },
  { x: 48, y: 17, width: 1, height: 2, event: InteractiveEvent.MintNFT },
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
