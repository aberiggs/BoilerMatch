import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to change read receipts settings for user - getReadReceiptsSettings");
    

    /* Setup */
    const { database } = await connectToDatabase();

    const userCollection = database.collection("users");
    console.log(req.query)
    if (!req.query) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating read receipts."
        })
        
    }
    const updatedData = {
        $set: {
            readReceiptsEnabled: req.body.readReceiptsEnabled
        }
    }
    const tokenData = jwt.verify(req.query.token, 'MY_SECRET', (err, payload) => {
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

    const filter = {username: tokenData.username}

    const user = await userCollection.findOne(filter);


    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }
  
    // Send the user's notification settings in the response
    console.log("INFORMATION", user.readReceiptsEnabled)
    return res.status(200).json({
      success: true,
      readReceiptsEnabled: user.readReceiptsEnabled,
    });
}