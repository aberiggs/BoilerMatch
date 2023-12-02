import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to block a user");

    const { database } = await connectToDatabase();
    const interactions = database.collection("interactions");

    const token = req.body.token;

    const currentUser = jwt.verify(token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
            })
        } else {
            return payload.username
        }
    });

    try {
      // Query the database for potential user suggestions based on the search term
      
      const userBlocked1 = await interactions.findOneAndUpdate(
        {
          "userInteracting": currentUser,
          "userInteractedWith": req.body.userNoNoti,
      },
      [{
          $set: {allowNoti: req.body.setting}
      }],
      {
        returnDocument: 'after'
      }
      ); 
      

      console.log(userBlocked1)
  
      return res.status(200).json({
        success: true,
        userBlocked1: userBlocked1.value,
        message: "User noti changed",
      });
    } catch (error) {
      console.error("Error while trying to block potential user:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
