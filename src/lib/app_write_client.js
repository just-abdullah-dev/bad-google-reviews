import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
.setEndpoint(`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`)
.setProject(`${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);

export const account = new Account(client);
export const csDatabase = new Databases(client);
export { ID } from "appwrite";

