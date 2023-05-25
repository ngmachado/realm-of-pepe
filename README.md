
![Banner](https://i.imgur.com/BedBRpJ.png)


# Realm of Pepe
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)[![MUD Superfluid](https://img.shields.io/badge/MUD-SUPERFLUID-f39f37)](https://superfluid.finance)

Realm of Pepe is a cooperative Adventure RPG with novel resource-management mechanics, powered by [Superfluid](https://superfluid.finance).
Collect Resources, trade for others and progress through stages to reach the Evil Pepe.

The project was built for the [Autonomous Worlds Hackathon](https://ethglobal.com/events/autonomous) by [ETHGlobal](https://ethglobal.com/).

## Demo
See the full ETHGlobal Showcase [here](https://ethglobal.com/showcase/realm-of-pepe-ju6pt).

[![Realm of Pepe](ezgif.com-resize.gif)](https://ethglobal.com/showcase/realm-of-pepe-ju6pt)


## Gameplay
- In this project, we’ve created a novel adventure RPG world in which resources are represented with tokens. Resource gathering, trading and crafting are represented in streams rather than one-off transactions.
- Players must find resource nodes scattered around the map and receive their resources in ongoing streams
- Traders allow swapping resource for crafting materials in an ongoing stream, which can be sent onwards to build soldiers represented as evolving NFTs
- Completing the evolving NFTs in each zone will unlock the next zone - there are four zones planned, with the final containing the game's final boss - Evil Pepe
- The game ends when enough resources from the final stage have been streamed towards Evil Pepe, and players collaborate to complete the round in the shortest time


## Implementation
- We did a custom deployment of Superfluid Protocol to enable streamable assets in MUD
- We created a custom integration between MUD and Superfluid Protocol using Lattice's PhaserX template, enabling interaction with Superfluid from the game frontend
- We also solved for optimistic updates of the frontend to enable seamless navigation of the game map
- We use burner wallets, and a zero-gas blockchain configuration to simplify user onboarding
- We implemented custom Super Tokens to represent assets, and an evolving NFT contract which changes forms as the total amount of resources streamed to it increase
- We also implemented a custom swapper contract which accepts a stream in and streams back another token
- We used a combination of downloaded and modified assets from free online sources and created some original designs for the game’s UI and character designs
- We composed the game’s original music score using 16-bit instruments


## Music

- [Realm of Pepe - Zone 1](https://drive.google.com/file/d/1Io-sbJfiCQ3OyPq8I2T-0MC5-Q0Hri_n/view)


## Stack
- [ethers.js](https://github.com/ethers-io/ethers.js)
- [viem](https://github.com/wagmi-dev/viem)
- [wagmi](https://github.com/wagmi-dev/wagmi)
- [foundry](https://github.com/foundry-rs/foundry)
- [MUD](https://github.com/latticexyz/mud)
- [Superfluid](https://github.com/superfluid-finance/protocol-monorepo)
## Team

- Nuno Machado [@ngmachado](https://www.github.com/ngmachado)
- Mikk Õun [@Mikkoun](https://www.github.com/mikkoun)
- Joanna Szymendera [@0xYoanna](https://twitter.com/0xYoanna)
- Vijay Michalik [@vijaymichalik](https://twitter.com/vijaymichalik)

