import { connectToDatabase } from "@/lib/mongodb";
import { Db,ObjectId} from "mongodb";
const jwt = require( 'jsonwebtoken');

//TODO Have not tested
export default async function handler(req, res) {
  console.log("Attempting to pull users liked by");

  const { database } = await connectToDatabase();
  const users = database.collection("users");
  // Get the search term from the query parameter
  //const user = req.query.user;

  const token = req.body.token;
  const gradYearFilter = req.body.gradYearFilter
  const majorFilter = req.body.majorFilter

  const currentUser = jwt.verify(token, 'MY_SECRET', (err, payload) => {
      if (err) {
          return res.status(400).json({
              success: false,
          })
      } else {
          return payload.username
      }
  });
  const excludedUsers = [...req.body.excludedUsers,currentUser]

const usersLikedBy = await users.aggregate([
      {
        $lookup: {
            from: "interactions",
            localField: "username",
            foreignField: "userInteracting",
            as: "InteractionsByUser"
      },
    },
    {
      $lookup: {
        from: "interactions",
        localField: "username",
        foreignField: "userInteractedWith",
        as: "InteractionsWithUser"
  },

},
      { $match: {
        $and: [
          {InteractionsWithUser: {$not: {$elemMatch: {userInteracting:currentUser, liked_or_disliked: "liked"}}}},
          {InteractionsWithUser: {$not: {$elemMatch: {userInteracting:currentUser, liked_or_disliked: "disliked"}}} },
          {InteractionsByUser: {$elemMatch: {userInteractedWith:currentUser, liked_or_disliked: "liked"}}},
          {InteractionsWithUser: {$not: {$elemMatch: {userInteracting:currentUser, didBlocking: true}}} },
          {InteractionsWithUser: {$not: {$elemMatch: {userInteracting:currentUser, gotBlocked: true}}} },
          {"username" : { $nin: excludedUsers }},
          {"discoverable": true},
          gradYearFilter !== null ? { "information.graduation": gradYearFilter } : {},
          majorFilter !== "" ? { "information.major": { $regex: new RegExp(majorFilter, 'i') }  } : {},]
      } },
      
      {
        $addFields: {
          interaction: {
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
      }}
    ]).toArray()
    
  // if (!user) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Missing user",
  //   });
  // }

console.log(usersLikedBy)
  try {
    
   
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

