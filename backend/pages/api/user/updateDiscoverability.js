import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to update discoverability")

    const { database } = await connectToDatabase();
    const users = database.collection("users");
    
    const token = req.body.token;

    const currentUser= jwt.verify(token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
            })
        } else {
            return payload.username
        }
    });
    

    try {
    // Query the database for potential user suggestions based on the search term
    const userUpdated = await users.findOneAndUpdate(
        { username: currentUser},
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