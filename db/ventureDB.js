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

  const connectProfiles = () => {
    const client = new MongoClient(URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    const profiles = client.db(DB_NAME).collection(PROFILES);
    return { client, profiles };
  };

  me.getItineraries = async (query = {}) => {
    const { client, itineraries } = connect();
    try {
      const data = await itineraries.find(query).toArray();
      console.log("Fetched data from Mongo:", data);
      return data;
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

  me.toggleItineraryLike = async (itineraryId, username) => {
    const { client, itineraries } = connect();
    try {
      const id = new ObjectId(itineraryId);
      const current = await itineraries.findOne(
        { _id: id },
        { projection: { likes: 1, liked_by: 1 } },
      );

      if (!current) return null;

      const likedBy = Array.isArray(current.liked_by) ? current.liked_by : [];
      const hasLiked = likedBy.includes(username);

      if (hasLiked) {
        const nextLikes = Math.max(0, (current.likes ?? 0) - 1);
        const updated = await itineraries.findOneAndUpdate(
          { _id: id, liked_by: username },
          {
            $pull: { liked_by: username },
            $set: { likes: nextLikes },
          },
          {
            returnDocument: "after",
            projection: { likes: 1 },
          },
        );

        return {
          liked: false,
          likes: updated?.likes ?? nextLikes,
        };
      }

      const nextLikes = (current.likes ?? 0) + 1;
      const updated = await itineraries.findOneAndUpdate(
        { _id: id, liked_by: { $ne: username } },
        {
          $addToSet: { liked_by: username },
          $set: { likes: nextLikes },
        },
        {
          returnDocument: "after",
          projection: { likes: 1 },
        },
      );

      return {
        liked: true,
        likes: updated?.likes ?? nextLikes,
      };
    } finally {
      await client.close();
    }
  };

  me.getAllUsers = async () => {
    const { client, profiles } = connectProfiles();
    try {
      return await profiles.find({}).toArray();
    } finally {
      await client.close();
    }
  };

  me.findUserByUsername = async (username) => {
    const { client, profiles } = connectProfiles();
    try {
      return await profiles.findOne({ username });
    } finally {
      await client.close();
    }
  };

  me.findUserById = async (id) => {
    const { client, profiles } = connectProfiles();
    try {
      return await profiles.findOne({ _id: new ObjectId(id) });
    } finally {
      await client.close();
    }
  };

  me.createUser = async (user) => {
    const { client, profiles } = connectProfiles();
    try {
      const result = await profiles.insertOne(user);
      return { _id: result.insertedId, ...user };
    } finally {
      await client.close();
    }
  };

  me.deleteUser = async (id) => {
    const { client, profiles } = connectProfiles();
    try {
      return await profiles.deleteOne({ _id: new ObjectId(id) });
    } finally {
      await client.close();
    }
  };

  me.deleteItinerariesByCreator = async (username) => {
    const { client, itineraries } = connect();
    try {
      return await itineraries.deleteMany({ creator: username });
    } finally {
      await client.close();
    }
  };

  me.getAllUsernames = async () => {
    const { client, profiles } = connectProfiles();
    try {
      return await profiles
        .find({}, { projection: { username: 1, _id: 0 } })
        .toArray();
    } finally {
      await client.close();
    }
  };

  me.followUser = async (followerUsername, targetUsername) => {
    const { client, profiles } = connectProfiles();
    try {
      await profiles.updateOne(
        { username: followerUsername },
        { $addToSet: { following: targetUsername } },
      );
      await profiles.updateOne(
        { username: targetUsername },
        { $addToSet: { followers: followerUsername } },
      );
    } finally {
      await client.close();
    }
  };

  me.unfollowUser = async (followerUsername, targetUsername) => {
    const { client, profiles } = connectProfiles();
    try {
      await profiles.updateOne(
        { username: followerUsername },
        { $pull: { following: targetUsername } },
      );
      await profiles.updateOne(
        { username: targetUsername },
        { $pull: { followers: followerUsername } },
      );
    } finally {
      await client.close();
    }
  };

  return me;
}

const ventureDB = VentureDB();
export default ventureDB;
