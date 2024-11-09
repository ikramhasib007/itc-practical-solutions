import * as dotenv from 'dotenv'
dotenv.config()

import { CodegenConfig } from "@graphql-codegen/cli";

const SchemaURI = process.env.API_URL ?? 'http://localhost:4001/graphql'

const config: CodegenConfig = {
  overwrite: true,
  schema: SchemaURI,
  documents: ["src/**/*.(j|t)s"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
    },
  },
  ignoreNoDocuments: true,
};

export default config;