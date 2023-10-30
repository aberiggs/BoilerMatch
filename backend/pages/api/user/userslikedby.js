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
    const usersLikedBy = await users.aggregate([
      {
        $lookup: {
            from: "interactions",
            localField: "username",
            foreignField: "userLiking",
            as: "InteractionsWhereUserIsLiking"
      },
    },
    {
      $lookup: {
        from: "interactions",
        localField: "username",
        foreignField: "userLiked",
        as: "InteractionsWhereUserIsLiked"
  },

},
      { $match: {
        $and: [
          {InteractionsWhereUserIsLiked: {$not: {$elemMatch: {userLiking:currentUser, liked: true}}}},
          {InteractionsWhereUserIsLiked: {$not: {$elemMatch: {userLiking:currentUser, disliked: true}}} },
          {InteractionsWhereUserIsLiking: {$elemMatch: {userLiked:currentUser, liked: true}}},
          {"username" : { $not: { $eq: currentUser} }},
          {"discoverable": true}]
      } },
       
    ]).toArray()
   
    return res.status(200).json({
      success: true,
      users: usersLikedBy,
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

