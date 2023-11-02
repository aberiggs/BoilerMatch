import { connectToDatabase } from "@/lib/mongodb";
import { Db,ObjectId} from "mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to undislike expired users");
    const { database } = await connectToDatabase();
    const interactions = database.collection("interactions");
    const token = req.body.token


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
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const updatedUsers = await interactions.updateMany(
        {
            userInteracting: currentUser,
            liked_or_disliked: "disliked",
            date_liked_or_disliked_changed: { $lte: oneWeekAgo }
        },
        {
            $set: { liked_or_disliked: "neither" }
        })

        console.log("updated users:\n")
        console.log(updatedUsers)
        return res.status(200).json({
            success: true,
            users: updatedUsers,
            message: "Potential users found",
        });
      } catch (error) {
        console.error("Error while undisliking users:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }