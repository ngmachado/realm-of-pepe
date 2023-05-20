import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    Counter: {
      keySchema: {},
      schema: "uint32",
    },
  SFContractTable: {
      keySchema: {
          id: "uint32",
      },
      schema: {
          contractAddress: "address",
      }
  },
  SFSuperTokenTable: {
        keySchema: {
            id: "uint32",
        },
        schema: {
            superTokenAddress: "address",
        }
  },
    Position: {
      schema: {
        x: "int32",
        y: "int32",
      },
    },
  },
});
