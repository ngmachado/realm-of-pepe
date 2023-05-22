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
      SFResourceGeneratorTable: {
            keySchema: {
                id: "uint32",
            },
            schema: {
                resourceGeneratorAddress: "address",
            }
      },
      SFStoreTable: {
            keySchema: {
                id: "uint32",
            },
            schema: {
                storeAddress: "address",
                inResource: "address",
                outResource: "address",
                maxFlowRate: "int96",
            }
      },
      SFOpenStreamTable: {
            keySchema: {
                token: "address",
                receiver: "address",
            },
            schema: {
                flowRate: "int96",
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
