import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
const pollingRate = 2 // Seconds

export default async function handler(req, res) {
    console.log("Attempting to get information about a conversation - unreadMessagesFromConversation")

    /* Setup */
    const { database } = await connectToDatabase();
    const messageCollection = database.collection("messages");

    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    if (!req.body || !req.body.token || !req.body.otherUser || req.body.unreadMessagesCount ) {
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

    console.log("CONVERSATIONNNNN")
    console.log(conversation)
    console.log(req.body.otherUser)

    if (!conversation) {
        return res.status(404).json({
            success: false,
            message: "No such conversation"
        })
    }

    let unreadMessageCount = 0;
    if (req.body.unreadMessagesCount == 0) {
        // Count unread messages

        conversation.messages.forEach(message => {
            if (!message.read && message.from == req.body.otherUser) {
                unreadMessageCount++;
            }
        });

        return res.status(200).json({
            success: true,
            unreadMessagesCount:unreadMessageCount
        })
    }
  
    /* Check to see if the user already has the most updated chat history */
    let lastUnreadMessageCountOnClient = req.body.unreadMessagesCount
    while (messagesEqual(lastUnreadMessageCountOnClient === unreadMessageCount)) {
        await sleep(pollingRate * 1000)
        conversation = await messageCollection.findOne(query)
        let unreadMessageCount = 0;
        conversation.messages.forEach(message => {
        if (!message.read && message.from == req.body.otherUser) {
            unreadMessageCount++;
        }
    });
    } 
        
        res.status(200).json({
            success: true,
            unreadMessagesCount:unreadMessageCount
        })

        return

}

const messagesEqual = (messageOne, messageTwo) => {
    if (!messageOne || !messageOne.from || !messageOne.message || !messageTwo || !messageTwo.from || !messageTwo.message) return false

    if (messageOne.from === messageTwo.from && messageOne.message === messageTwo.message) return true

    return false
}