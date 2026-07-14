import { ObjectId } from "mongodb";
import { getDB } from "../db/ventureDB.js";

const COLLECTION = "user_profiles";

export async function createUser(user) {
  const result = await getDB().collection(COLLECTION).insertOne(user);
  return { _id: result.insertedId, ...user };
}

export async function findUserByEmail(email) {
  return getDB().collection(COLLECTION).findOne({ email });
}

export async function findUserById(id) {
  return getDB()
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
}

export async function deleteUser(id) {
  return getDB()
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
}
