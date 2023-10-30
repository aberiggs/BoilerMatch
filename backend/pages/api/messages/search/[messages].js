import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to search for the message")

    const { database } = await connectToDatabase();
    const messageCollection = database.collection("messages");
    if (!req.query.messages) {
        return res.status(400).json({
            success: false,
            message: "Missing messages"
        })
    }

    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    if (!req.headers.authorization) {
        console.log("FAILLLLL")
        console.log(req.headers.authorization)
        return res.status(400).json({
            success: false,
            message: "Insufficient information to send message."
        })
    }

    // check if token is there
    const token = req.headers.authorization
    if (!token) {
        console.log("NO TOKEN")
        return res.status(400).json({
            success: false,
            message: "Missing token"
        });
    }

    /* Authenticate the user */
    const tokenData = jwt.verify(token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
            })
        } else {
            return payload
        }
    });
  
    // try to authenticate user with above function
    if (!tokenData) {
        console.log("Authentication failed")
        return res.status(400).json({
            success: false,
        })
    }

    // set username and use for query 
    const username = tokenData.username
   
    const messagesRegex = new RegExp(req.query.messages, "i");
    const returnMessages = await messageCollection.aggregate([
        {
            //deconstruct messages array in each document 
            //each message in array is now a separate document    
            $unwind: "$messages"
        },
        {
            //match: filter that retains only documents that meet specified condition
            $match: {
                //filters documents to include only those where message matches regex
                "messages.message": messagesRegex,
                //also filters looking for messages that involve the specific user
                $or: [
                    { userOne: username },
                    { userTwo: username }
                ]
            }
        }
      ]).toArray();

    if (returnMessages.length == 0) {  
        console.log("No messages found")
        return res.status(400).json({
            success: false,
            message: "No messages found"
        })
        
    } else {
        console.log(returnMessages)
        return res.status(200).json({
            success: true,
            messages: returnMessages,
            message: "Messages found"
        })
    }
  


}