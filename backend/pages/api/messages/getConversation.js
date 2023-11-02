import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
const pollingRate = 2 // Seconds

export default async function handler(req, res) {
    console.log("Attempting to get a conversation")

    /* Setup */
    const { database } = await connectToDatabase();
    const messageCollection = database.collection("messages");

    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    if (!req.body || !req.body.token || !req.body.otherUser) {
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

    /* Look for a conversation between the two users */
    const query = {$or: [{userOne: req.body.otherUser, userTwo: username},{userOne: username, userTwo: req.body.otherUser}]}
    let conversation = await messageCollection.findOne(query)

    if (!conversation) {
        return res.status(404).json({
            success: false,
            message: "No such conversation"
        })
    }

    if (!req.body.previousMessages) {
        console.log("No previousMessages")
        res.status(200).json({
            success: true,
            messages: conversation.messages
        })
        return
    }

    /* Check to see if the user already has the most updated chat history */
    let lastMessageOnClient = req.body.previousMessages[req.body.previousMessages.length - 1]
    let lastMessageInDb = conversation.messages[conversation.messages.length - 1]
    
    if (lastMessageOnClient && lastMessageInDb) {
        while (messagesEqual(lastMessageOnClient, lastMessageInDb)) {
            await sleep(pollingRate * 1000)
            conversation = await messageCollection.findOne(query)
            lastMessageInDb = conversation.messages[conversation.messages.length - 1]
        } 
        
        res.status(200).json({
            success: true,
            messages: conversation.messages
        })

        return
    }

    
    res.status(400).json({
        success: false,
        message: "An unexpected error occurred"
    })
}

const messagesEqual = (messageOne, messageTwo) => {
    if (!messageOne || !messageOne.from || !messageOne.message || !messageTwo || !messageTwo.from || !messageTwo.message) return false

    if (messageOne.from === messageTwo.from && messageOne.message === messageTwo.message) return true

    return false
}