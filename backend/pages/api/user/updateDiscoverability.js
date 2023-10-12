import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    console.log("Attempting to update discoverability")

    const { database } = await connectToDatabase();
    const users = database.collection("users");
    
    const user = new ObjectId("65179cef3a0d783d76159f8b");


    console.log(req.body.user)

    try {
    // Query the database for potential user suggestions based on the search term
    const userUpdated = await users.findOneAndUpdate(
        { _id: user},
        [
            {$set: {discoverable: { $not: "$discoverable" } }}
        ]
    )

    return res.status(200).json({
      success: true,
      userUpdated: userUpdated,
      message: "Flipped discoverability",
    });
  } catch (error) {
    console.error("Error while flipping discoverability:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}