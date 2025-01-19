import { Client, Account, Databases } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6787813e002b9d0000d4")
//   .set(
//     "standard_8bfb1210f28c12f35ea684b1acc9266d5974cfd55d410e004cbbd2715eb1efd65daec9e994b46f30ce33a255b597bfb6e40808b5220ebe21fea0aca49fd06f1960ea0b17e54b8ec73ca1056a3c193b4cbb84b156fee33756efd3216db8653750f6b35b415a621b338dd962d8dadbd162c02b739cc07155c30cb3d4a92769c9f8"
//   ); // Replace with your project ID

export const databases = new Databases(client);
export { ID } from "appwrite";
