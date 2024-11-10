const sdk = require("node-appwrite");

const serverSide = new sdk.Client();

serverSide
  .setEndpoint(`${process.env.APPWRITE_ENDPOINT}`)
  .setProject(`${process.env.APPWRITE_PROJECT_ID}`)
  .setKey(`${process.env.APPWRITE_SECRET_KEY}`);

export const ssDatabase = new sdk.Databases(serverSide);
export const ssUsers = new sdk.Users(serverSide);
