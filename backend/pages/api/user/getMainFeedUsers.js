import { connectToDatabase } from "@/lib/mongodb";
import { Db,ObjectId} from "mongodb";
const jwt = require( 'jsonwebtoken');

//TODO Have not tested
export default async function handler(req, res) {
  console.log("Attempting to refresh feed");

  const { database } = await connectToDatabase();
  const users = database.collection("users")
  const interactions = database.collection("interactions")
  // Get the search term from the query parameter
  //const user = req.query.user;
//   if (!user) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing user",
//     });
//   }

const token = req.body.token


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
    const potentialUsers = await users.aggregate([
        { 
            $lookup: {
                from: "interactions",
                localField: "username",
                foreignField: "userInteractedWith",
                as: "InteractionsWithUser"
            },
        },
        {
            $match: {
            $and:[ 
              {InteractionsWithUser: {$not: {$elemMatch: {userInteracting:currentUser, liked_or_disliked: "liked"}}} },
              {InteractionsWithUser: {$not: {$elemMatch: {userInteracting:currentUser, liked_or_disliked: "disliked"}}} },
              {InteractionsWithUser: {$not: {$elemMatch: {userInteracting:currentUser, didBlocking: true}}} },
              {InteractionsWithUser: {$not: {$elemMatch: {userInteracting:currentUser, gotBlocked: true}}} },
            {"username" : { $not: { $eq: currentUser} }},
            {"discoverable": true}
          ]
    }},
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
    {$sample: {
      size: 5
    }},
    ]).toArray()
    console.log(potentialUsers)

    return res.status(200).json({
      success: true,
      users: potentialUsers,
      message: "Potential users found",
    });
  } catch (error) {
    console.error("Error while searching for potential users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}