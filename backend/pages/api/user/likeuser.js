import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    console.log("Attempting to like/dislike a user")

    const { database } = await connectToDatabase();
    const interactions = database.collection("interactions");
    
    const user = new ObjectId("65179cef3a0d783d76159f8b");
    const userShown = new ObjectId("65185fe2162043af5f644070");
    const liked = true;

    console.log(req.body.user)
    // if (!req.body.user || !req.body.userShown || !req.body.liked) {
    //    return res.status(400).json({
    //         success: false,
    //         message: "Missing information"
    //     })
    // }
    

    try {
    // Query the database for potential user suggestions based on the search term
    const userAdded = await interactions.insertOne({
        "userLiking": user, "userLiked": userShown, "liked": true
    })

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