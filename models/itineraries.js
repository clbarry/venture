import { ObjectId } from "mongodb";
import { getDB } from "../db/ventureDB.js";

const COLLECTION = "itineraries";

export async function createItinerary(itinerary) {
  const result = await getDB().collection(COLLECTION).insertOne(itinerary);
  return { _id: result.insertedId, ...itinerary };
}

export async function findItineraryByTitle(title) {
  return getDB().collection(COLLECTION).findOne({ title });
}

export async function findItineraryById(id) {
  return getDB()
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
}

export async function deleteItinerary(id) {
  return getDB()
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
}
