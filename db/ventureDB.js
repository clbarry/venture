import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import "dotenv/config";

function VentureDB() {
  const me = {};

  const USER = process.env.MONGOUSER;
  const PASS = process.env.MONGOPASS;
  const CONNECTION_STRING = process.env.CONNECTION_STRING;
  if (!USER || !PASS) {
    throw new Error("Missing MONGOUSER or MONGOPASS environment variable");
  }

  const encodedUser = encodeURIComponent(USER);
  const encodedPass = encodeURIComponent(PASS);
  const URI = `mongodb+srv://${encodedUser}:${encodedPass}@${CONNECTION_STRING}`;
  const DB_NAME = "venture";
  const COLLECTION = "itineraries";
  const PROFILES = "user_profiles";
  const connect = () => {
    const client = new MongoClient(URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    const itineraries = client.db(DB_NAME).collection(COLLECTION);
    return { client, itineraries };
  };
  me.getItineraries = async (query = {}) => {
    const { client, itineraries } = connect();

    try {
      const data = await itineraries.find(query).toArray();
      console.log("Fetched data from Mongo:", data);
      return data;
    } catch (err) {
      throw err;
    } finally {
      await client.close();
    }
  };

  me.deleteItinerary = async (itineraryId) => {
    const { client, itineraries } = connect();
    try {
      const id = new ObjectId(itineraryId);
      const it = await itineraries.findOne({ _id: id });
      if (!it) return { deleted: false, reason: "not found" };

      await itineraries.deleteOne({ _id: id });
      return { deleted: true };
    } catch (err) {
      throw err;
    } finally {
      await client.close();
    }
  };

  me.createItinerary = async (record) => {
    const { client, itineraries } = connect();
    try {
      return await itineraries.insertOne(record);
    } finally {
      await client.close();
    }
  };
}

const ventureDB = VentureDB();
export default ventureDB;
