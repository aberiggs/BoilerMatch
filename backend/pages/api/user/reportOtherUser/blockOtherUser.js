import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
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
        const userBlocked = await interactions.findOneAndUpdate(
          {
            "userInteracting": currentUser,
            "userInteractedWith": req.body.userBlocked
        },
        [{
            $set: {blocked: true}
        }],
        {
            upsert: true,
            new: true
        }
        );
        console.log(userBlocked)
    
        return res.status(200).json({
          success: true,
          userBlocked: userBlocked,
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
    
//     try {
//         const blocked = await interactions.aggregate([
//             { $match: {
//                 $and: [
//                   {"userInteracting":currentUser},
//                   {"liked_or_disliked": "liked"},
//                   {"userInteractedWith" : req.body.userBlocked}
//                 ]
//               } },
//             {
//           $lookup: {
//             from: "users",
//             localField: "userInteractedWith",
//             foreignField: "username",
//             as: "userInfo"
//       },
    
//     },
           
//         ]).toArray()
//         console.log(blocked)
       
//         return res.status(200).json({
//           success: true,
//           users: blocked,
//           message: "User blocked",
//         });
//       } catch (error) {
//         console.error("Error while trying to block a user:", error);
//         return res.status(500).json({
//           success: false,
//           message: "Internal server error",
//         });
//       }

// }

//     const userAdded = await interactions.insertOne({
//         "userInteracting": currentUser,
//         "userInteractedWith": req.body.userBlocked,
//         "blocked": true
//     });
         

//     if (!userAdded.insertedId) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found in interactions",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       user_added: userAdded.value,
//       message: "User blocked successfully",
//     });
//   } catch (error) {
//     console.error("Error while attempting to block a user:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });

