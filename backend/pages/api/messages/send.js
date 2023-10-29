import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to send a chat")

    /* Setup */
    const { database } = await connectToDatabase();
    const messageCollection = database.collection("messages");

    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    if (!req.body || !req.body.token || !req.body.toUser || !req.body.messageToSend) {
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


    const newMessage = {from: username, message: req.body.messageToSend}

    /* Look for a conversation between the two users */
    const query = {$or: [{userOne: req.body.toUser, userTwo: username},{userOne: username, userTwo: req.body.toUser}]}
    const conversation = await messageCollection.findOne(query)

    /* Create a conversation if one doesn't exist yet */
    /* TODO: This will be removed later once matching functionality triggers a conversation to be created. */
    if (!conversation) {
        const newConversation = {userOne: username, userTwo: req.body.toUser, messages: [newMessage]}
        await messageCollection.insertOne(newConversation).catch(err => {
            return res.status(400).json({
                success: false,
                message: "An unexpected error occurred while creating a new conversation"
            })
        })

        
        return res.status(200).json({
            success: true,
            message: "Message successfully added"
        })
    }

    /* Add new message to message history */

    conversation.messages.push(newMessage)

    const updateDocument = {
        $set: {
           messages: conversation.messages,
        },
    };

    await messageCollection.updateOne({_id: conversation._id}, updateDocument)

    res.status(200).json({
        success: true,
        message: "Message successfully added"
    })
}