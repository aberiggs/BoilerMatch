import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to search for the message")

    const { database } = await connectToDatabase();
    const messagesCollection = database.collection("messages");
    if (!req.query.messages) {
        return res.status(400).json({
            success: false,
            message: "Missing messages"
        })
    }

    //aggregate and matching
   
    const messagesRegex = new RegExp(req.query.messages, "i");
    const returnMessages = await messagesCollection.aggregate([
        {
          $unwind: "$messages"
        },
        {
          $match: {
            "messages.message": messagesRegex
          }
        }
      ]).toArray();
//     console.log(messagesRegex)
//     console.log(" ")
//   //  console.log(returnMessages)
    //console.log(returnMessages)
    if (returnMessages.length == 0) {  
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