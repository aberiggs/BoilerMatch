import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
  if (!req.query || !req.query.token || !req.query.userBlocked) {
    console.log("NOOOOOOO")
    return res.status(400).json({
        success: false,
        message: "Insufficient information to send message."
    })
}
    console.log("Attempting to UNMATCH a user");

    const { database } = await connectToDatabase();
    const interactions = database.collection("interactions");

    const token = req.query.token;

    const currentUser = jwt.verify(token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
            })
        } else {
            console.log("no error")
            return payload
        }
    });
    try {
      console.log("DO i get here")
      console.log("CURRENT USER: ", currentUser)
      const username = currentUser.username
      const query = {$or: [{userInteracting: username, userInteractedWith: req.query.userBlocked},{userInteracting: req.query.userBlocked, userInteractedWith: username}]}
      let interaction = await interactions.findOne(query)
      console.log(interaction)
      console.log("ID!!!: ", interaction._id)
      const deleteResult = await interactions.deleteOne({ _id: interaction._id });
      const queryTwo = {$or: [{userInteracting: username, userInteractedWith: req.query.userBlocked},{userInteracting: req.query.userBlocked, userInteractedWith: username}]}
      let interactionTwo = await interactions.findOne(queryTwo)
      const deleteResultTwo = await interactions.deleteOne({ _id: interactionTwo._id });
  
      return res.status(200).json({
        success: true,
        message: "User unmatched",
      });
    } catch (error) {
      console.error("Error while trying to unmatch potential user:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
