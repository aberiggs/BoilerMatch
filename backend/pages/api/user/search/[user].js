import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to search for the user")

    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");
    if (!req.query.user) {
       return res.status(400).json({
            success: false,
            message: "Missing username"
        })
    }

 //   const token = req.params.token;
    
    const token = req.headers.authorization
    if (!token) {
        console.log("NO TOKEN")
        return res.status(400).json({
            success: false,
            message: "Missing token"
        });
    }

    const currentUser = jwt.verify(token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
            })
        } else {
            return payload.username
        }
    });
    const usernameRegex = new RegExp(req.query.user, "i");
    const users = await userCollection.aggregate([
        {
            $match: {
                username: usernameRegex
            }
        },
        {
            $lookup: {
                from: "interactions",
                localField: "username",
                foreignField: "userInteractedWith",
                as: "InteractionsWithUser"
            }
        },
        {
            $match: {
                $and: [
                 {InteractionsWithUser: {$not: {$elemMatch: {userInteracting:currentUser, gotBlocked: true}}} },
                 {discoverable: true}
                ]
            }
        },
        {
            $addFields: {
              "interaction":  {
                $filter: {
                    input: "$InteractionsWithUser",
                    as: "interaction",
                    cond: { $eq: ["$$interaction.userInteracting",  currentUser] }
                }
                }
          },
        },

    ]
    ).toArray()

    if (users.length == 0) {
        return res.status(400).json({
            success: false,
            message: "No users found"
        })
        
    } else {
        return res.status(200).json({
            success: true,
            users: users,
            message: "users found"
        })
    }
  


}