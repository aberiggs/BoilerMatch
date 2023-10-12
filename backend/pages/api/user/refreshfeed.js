import { connectToDatabase } from "@/lib/mongodb";
import { Db,ObjectId} from "mongodb";


//TODO Have not tested
export default async function handler(req, res) {
  console.log("Attempting to refresh feed");

  const { database } = await connectToDatabase();
  const users = database.collection("users")
  const interactions = database.collection("interactions")
  // Get the search term from the query parameter
  //const user = req.query.user;
  const currentUserID = new ObjectId('65179cef3a0d783d76159f8b');
//   if (!user) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing user",
//     });
//   }
// const tokenDecoded = jwt.verify(req.body.token, 'MY_SECRET', (err, payload) => {
//     if (err) {
//         return res.status(400).json({
//             success: false,
//         })
//     } else {
//         return payload
//     }
// });



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
    {
        $project: {
            InteractionsWhereUserIsLiked: 0
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

