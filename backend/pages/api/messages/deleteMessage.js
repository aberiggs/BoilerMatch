import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to delete a message")

    /* Setup */
    const { database } = await connectToDatabase();
    const messageCollection = database.collection("messages");

    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    if (!req.body || !req.body.token || !req.body.otherUser || !req.body.timestamp ) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information to send message."
        })
    }

    /* Authenticate the user */
    const tokenData = jwt.verify(req.body.token, 'MY_SECRET', (err, payload) => {
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
    
    const username = tokenData.username

    const formattedTimestamp = new Date(req.body.timestamp)

    const query = {$or: [{userOne: req.body.otherUser, userTwo: username},{userOne: username, userTwo: req.body.otherUser}]}
    let conversation = await messageCollection.findOne(query)

    if (!conversation) {
        return res.status(404).json({
            success: false,
            unreadMessagesCount: 0,
            message: "No such conversation"
        })
    }

    //console.log("Our timestamp", formattedTimestamp.toString())
    
    //conversation.messages.forEach((element) => console.log(element.timestamp.toString()));

    const newMessageHistory = conversation.messages.filter((message) => message.timestamp.toString() != formattedTimestamp.toString())
    //console.log("New History", newMessageHistory)
    
    await messageCollection.updateOne(query, { $set: { messages: newMessageHistory } });
    return res.status(200).json({
        success: true,
        message: "Reaction updated successfully."
    });
 
}