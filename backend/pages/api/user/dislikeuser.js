import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to dislike a user")

    const { database } = await connectToDatabase();
    const interactions = database.collection("interactions");

    // if (!req.body.user || !req.body.userShown || !req.body.liked) {
    //    return res.status(400).json({
    //         success: false,
    //         message: "Missing information"
    //     })
    // }
    const token = req.body.token;

    const currentUser = jwt.verify(token, 'MY_SECRET', (err, payload) => {
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
    const userAdded = await interactions.findOneAndUpdate(
      {
        "userInteracting": currentUser,
        "userInteractedWith": req.body.userShown
      },
      [{
        $set: {
          liked_or_disliked: {
            $cond: {
              if: {
                 $not: {$eq: ["$liked_or_disliked", "disliked"] },
              },
              "then": "disliked",
              "else": "neither"
            }
          },
          date_liked_or_disliked_changed: "$$NOW"
        },
      }],
      {
        upsert: true,
        new: true
      }
  
    );

    return res.status(200).json({
      success: true,
      user_added: userAdded,
      message: "Potential users found",
    });
  } catch (error) {
    console.error("Error while searching for potential users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}