import { connectToDatabase } from "@/lib/mongodb";
import { Db,ObjectId} from "mongodb";
const jwt = require( 'jsonwebtoken');

//TODO Have not tested
export default async function handler(req, res) {
  console.log("Attempting to pull bookmarked users");

  const { database } = await connectToDatabase();
  const users = database.collection("users")
  const interactions = database.collection("interactions")
  // Get the search term from the query parameter
  //const user = req.query.user;

  // if (!user) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Missing user",
  //   });
  // }
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
    const bookmarkedUsers = await interactions.aggregate([
        { $match: {
            $and: [
              {"userInteracting":currentUser},
              {"liked_or_disliked": "liked"},
              {"userInteractedWith" : { $not: { $eq: currentUser} }}
            ]
          } },
        {
      $lookup: {
        from: "users",
        localField: "userInteractedWith",
        foreignField: "username",
        as: "userInfo"
  },

},
       
    ]).toArray()
    console.log(bookmarkedUsers)
   
    return res.status(200).json({
      success: true,
      users: bookmarkedUsers,
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

