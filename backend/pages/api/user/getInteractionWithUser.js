import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to get interaction with a user")

    const { database } = await connectToDatabase();
    const interactions = database.collection("interactions");
  

    console.log(req.body.userShown)
    // if (!req.body.user || !req.body.userShown || !req.body.liked) {
    //    return res.status(400).json({
    //         success: false,
    //         message: "Missing information"
    //     })
    // }
    const token = req.body.token;
    console.log("token", token)

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
    const interaction = await interactions.findOne(
      {
        "userInteracting": currentUser, "userInteractedWith": req.body.userShown
     }
    )

    return res.status(200).json({
      success: true,
      interaction: interaction,
      viewingSelf: req.body.userShown == currentUser,
      message: "interaction found",
    });
  } catch (error) {
    console.error("interaction not found:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}