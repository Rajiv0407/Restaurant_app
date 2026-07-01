import { MongoClient } from "mongodb";
const url="mongodb://localhost/27017/";
const client=new MongoClient(url);

   
async function ConnectDb(){
  const connect= await client.connect();//Connect with MongoDB
   //const db= client.db('Restaurant'); //Connect with Data Base 
   const db= connect.db('Restaurant');
   return db;   
}
export default ConnectDb;            