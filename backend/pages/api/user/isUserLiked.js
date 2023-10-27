import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to like/dislike a user")

    const { database } = await connectToDatabase();
    const interactions = database.collection("interactions");
  

    console.log(req.body.user)
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
    const user = await interactions.findOne(
      {
        "userLiking": req.body.userShown, "userLiked": currentUser
     },
     {
        "userLiking":0, "userLiked":1, "liked": 1
     }
    )

    return res.status(200).json({
      success: true,
      liked: user!=null ? user.liked:false,
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