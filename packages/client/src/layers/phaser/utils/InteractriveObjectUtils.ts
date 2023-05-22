export enum InteractiveEvent {
  StartMining,
  StartExchange,
}

export const InteractiveTiles = [
  { x: 28, y: 29, width: 2, height: 2, event: InteractiveEvent.StartMining },
  { x: 28, y: 11, width: 2, height: 2, event: InteractiveEvent.StartExchange },
];

export function getInteractiveTile(x: number, y: number) {
  console.log(x, y);
  return InteractiveTiles.find((tile) => {
    console.log(tile.x, tile.x + tile.width, tile.y, tile.y + tile.height);
    return (
      tile.x <= x &&
      tile.x + tile.width >= x &&
      tile.y <= y &&
      tile.y + tile.height >= y
    );
  });
}
