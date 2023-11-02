import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to delete a conversation")

    /* Setup */
    const { database } = await connectToDatabase();
    const messageCollection = database.collection("messages");

    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    if (!req.query || !req.query.token || !req.query.userBlocked) {
        console.log("NOOOOOOO")
        return res.status(400).json({
            success: false,
            message: "Insufficient information to send message."
        })
    }

    console.log("HERE1")
    /* Authenticate the user */
    const tokenData = jwt.verify(req.query.token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Token verification failed:",
                error: err
            })
        } else {
            return payload
        }
    });
  
    if (!tokenData) {
        return res.status(400).json({
            success: false,
        })
    }
    
    console.log("HERE2")
    const username = tokenData.username

    /* Look for a conversation between the two users */
    const query = {$or: [{userOne: req.query.userBlocked, userTwo: username},{userOne: username, userTwo: req.query.userBlocked}]}
    let conversation = await messageCollection.findOne(query)

    if (!conversation) {
        return res.status(404).json({
            success: false,
            message: "No such conversation"
        })
    }

    // delete the conversation
    console.log("ID              ", conversation._id)
    const deleteResult = await messageCollection.deleteOne({ _id: conversation._id });

    if (deleteResult.deletedCount === 1) {
        return res.status(200).json({
            success: true,
            message: "Conversation deleted successfully"
        });
    } else {
        return res.status(500).json({
            success: false,
            message: "Failed to delete the conversation"
        });
    }

}