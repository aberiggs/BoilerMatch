import { connectToDatabase } from "@/lib/mongodb";
import { Db,ObjectId} from "mongodb";
const jwt = require( 'jsonwebtoken');

//TODO Have not tested
export default async function handler(req, res) {
  console.log("Attempting to pull users liked by");

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
    const usersLikedBy = await users.aggregate([
      {
        $lookup: {
            from: "interactions",
            localField: "username",
            foreignField: "userLiking",
            as: "InteractionsWhereUserIsLiked"
      },
      },
        { $match: {
            "InteractionsWhereUserIsLiked.userLiked": currentUser,
            "discoverable": true,
            "InteractionsWhereUserIsLiked.liked":true
        } },
       {
        $project: {InteractionsWhereUserIsLiked: 0}
       } ,
    ]).toArray()
    const usersLiked = await users.aggregate([
      {
        $lookup: {
            from: "interactions",
            localField: "username",
            foreignField: "userLiked",
            as: "InteractionsWhereUserIsLiking"
      },
      },
        { $match: {
            "InteractionsWhereUserIsLiking.userLiking": currentUser,
            "discoverable": true,
            "InteractionsWhereUserIsLiking.liked":true
        } },
        {
          $project: {InteractionsWhereUserIsLiking: 0}
         }
    ]).toArray()
    
    const potentialUsers = usersLikedBy.filter((userBy) => {
      return !usersLiked.some((userLiked) => userLiked.username === userBy.username);
    });
    console.log(usersLiked)
    //console.log(potentialUsers)
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

