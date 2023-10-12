import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    console.log("fetching discoverability")

    const { database } = await connectToDatabase();
    const users = database.collection("users");
    
    const userId = new ObjectId("65179cef3a0d783d76159f8b");


    console.log(req.body.user)

    try {
    // Query the database for potential user suggestions based on the search term
    const user = await users.findOne(
        {_id: userId},
        {_id: 0,discoverable: 1}
        )
    return res.status(200).json({
      success: true,
      discoverability: user.discoverable,
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