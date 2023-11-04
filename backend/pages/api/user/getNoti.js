import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to change notification settings for user");
    

    /* Setup */
    const { database } = await connectToDatabase();

    const userCollection = database.collection("users");
    console.log(req.query)
    if (!req.query) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating preference."
        })
        
    }
    const updatedData = {
        $set: {
            recieveNotifications: req.body.recieveNotifications
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
    return res.status(200).json({
      success: true,
      notificationsEnabled: user.recieveNotifications,
    });
}