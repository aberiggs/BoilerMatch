import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to create a chat")

    /* Setup */
    const { database } = await connectToDatabase();
    const messageCollection = database.collection("messages");
    const currentDateTime = new Date()


    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    console.log("body ", req.body)
    console.log("token ", req.body.token)
    console.log("toUser ", req.body.toUser)


    if (!req.body || !req.body.token || !req.body.toUser) {
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

   const newMessage = {from: username, message: [], timestamp: currentDateTime, opened: "no", readTime: "no"}


    const newConversation = {userOne: username, userTwo: req.body.toUser.username, last_updated: currentDateTime, messages: [newMessage]}
    await messageCollection.insertOne(newConversation).catch(err => {
        return res.status(400).json({
            success: false,
            message: "An unexpected error occurred while creating a new conversation"
        })
    })

    
    return res.status(200).json({
        success: true,
        message: "Created conversation"
    })


    
}