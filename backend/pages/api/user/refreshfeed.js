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
console.log("hello")
console.log(req);

const token = req.body.token


const currentUserID = jwt.verify(token, 'MY_SECRET', (err, payload) => {
    if (err) {
        return res.status(400).json({
            success: false,
        })
    } else {
        return payload._id
    }
});



  try {
    // Query the database for potential user suggestions based on the search term
    const potentialUsers = await users.aggregate([
        { 
            $lookup: {
                from: "interactions",
                localField: "_id",
                foreignField: "userLiked",
                as: "InteractionsWhereUserIsLiked"
            },
        },
        {
            $match: {
            "InteractionsWhereUserIsLiked.userLiking": { $not: { $eq: currentUserID} },
            "_id" : { $not: { $eq: currentUserID} },
            "discoverable": true
        }
    }, 
    {$sample: {
      size: 5
    }},
    {
        $project: {
          username: 1
            // InteractionsWhereUserIsLiked: 0
        }
    }
    ]).toArray()
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

