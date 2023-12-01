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

    console.log(currentUser)
    console.log(req.body.userBlocked)

    try {
      // Query the database for potential user suggestions based on the search term
      
      const userBlocked1 = await interactions.findOneAndUpdate(
        {
          "userInteracting": req.body.userBlocked,
          "userInteractedWith": currentUser,
      },
      [{
        $set: {
            gotBlocked: {
                $cond: {
                    if: { $eq: ["$gotBlocked", true] },
                    then: false,
                    else: true,
                }
            }
        }
    }],
      {
          upsert: true,
          new: true
      }
      ); 

      const userBlocked2 = await interactions.findOneAndUpdate(
        {
          "userInteracting": currentUser,
          "userInteractedWith": req.body.userBlocked,
      },
      [{
        $set: {
            didBlocking: {
                $cond: {
                    if: { $eq: ["$didBlocking", true] },
                    then: false,
                    else: true,
                }
            },
        }
    }],
      {
          upsert: true,
          new: true
      }
      );
      

      console.log(userBlocked1)
      console.log(userBlocked2)
  
      return res.status(200).json({
        success: true,
        userBlocked1: userBlocked1,
        userBlocked2: userBlocked2,
        message: "User blocked",
      });
    } catch (error) {
      console.error("Error while trying to block potential user:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
