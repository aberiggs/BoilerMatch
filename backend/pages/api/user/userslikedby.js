import { connectToDatabase } from "@/lib/mongodb";
import { Db,ObjectId} from "mongodb";
//TODO Have not tested
export default async function handler(req, res) {
  console.log("Attempting to pull users liked by");

  const { database } = await connectToDatabase();
  const users = database.collection("users")
  const interactions = database.collection("interactions")
  // Get the search term from the query parameter
  //const user = req.query.user;
  const currentUserID = new ObjectId('65234a7ae2b3c6ca82357351');
//   if (!user) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing user",
//     });
//   }


  try {
    // Query the database for potential user suggestions based on the search term
    const potentialUsers = await users.aggregate([
        { 
            $lookup: {
                from: "interactions",
                localField: "_id",
                foreignField: "userLiking",
                as: "InteractionsWhereUserIsLiking"
            },
        },
        { $match: {
            "InteractionsWhereUserIsLiking.userLiked": currentUserID
        } },
        {$project: {InteractionsWhereUserIsLiking: 0}}
        

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

