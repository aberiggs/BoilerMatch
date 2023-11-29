import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to update the reactions of a message")

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

    let updateReactionCount = 0;
    conversation.messages.forEach(message => {
        if (message.timestamp.toString() == formattedTimestamp.toString() ) {
            message.reactions = req.body.reactions;
            updateReactionCount++;
        }
    });
    
    if (updateReactionCount === 1) {
        await messageCollection.updateOne(query, { $set: { messages: conversation.messages } });
        return res.status(200).json({
            success: true,
            message: "Reaction updated successfully."
        });
    } else {
        return res.status(404).json({
            success: false,
            message: "Message not found or no update needed."
        });
    }
}

    // /* Look for the message between the two users */
    // try {
    //     /* Find the message and update reactions */
    //     const query = {
    //         $and: [
    //             { $or: [{ from: username, toUser: req.body.otherUser }, { from: req.body.otherUser, toUser: username }] },
    //             { timestamp: formattedTimestamp }
    //         ]
    //     };

    //     const update = { $set: { reactions: req.body.reactions } };

    //     const result = await messageCollection.updateOne(query, update);

    //     if (result.modifiedCount === 1) {
    //         return res.status(200).json({
    //             success: true,
    //             message: "Reaction updated successfully."
    //         });
    //     } else {
    //         return res.status(404).json({
    //             success: false,
    //             message: "Message not found or no update needed."
    //         });
    //     }
    // } catch (error) {
    //     console.error("Error updating reaction:", error);
    //     return res.status(500).json({
    //         success: false,
    //         message: "Internal server error."
    //     });
    // }
  
//     /* Check to see if the user already has the most updated chat history */
//     let lastMessageOnClient = req.body.previousMessages[req.body.previousMessages.length - 1]
//     let lastMessageInDb = conversation.messages[conversation.messages.length - 1]
    
//     if (lastMessageOnClient && lastMessageInDb) {
//         while (messagesEqual(lastMessageOnClient, lastMessageInDb)) {
//             await sleep(pollingRate * 1000)
//             conversation = await messageCollection.findOne(query)
//             lastMessageInDb = conversation.messages[conversation.messages.length - 1]
//         } 
        
//         res.status(200).json({
//             success: true,
//             messages: conversation.messages,
//             unreadMessagesCount: unreadMessagesCount
//         })

//         return
//     }

//     res.status(400).json({
//         success: false,
//         message: "An unexpected error occurred",
//         unreadMessagesCount: 0,
//     })
// }

// const messagesEqual = (messageOne, messageTwo) => {
//     if (!messageOne || !messageOne.from || !messageOne.message || !messageTwo || !messageTwo.from || !messageTwo.message) return false

//     if (messageOne.from === messageTwo.from && messageOne.message === messageTwo.message) return true

//     return false
// }