import { connectToDatabase } from "@/lib/mongodb";
import { Db,ObjectId} from "mongodb";
const jwt = require( 'jsonwebtoken');

//TODO Have not tested
export default async function handler(req, res) {
  console.log("Attempting to pull all matches");

  const { database } = await connectToDatabase();
  const users = database.collection("users")
  const interactions = database.collection("interactions")
  const messages = database.collection("messages")


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
    const matchedUsers = await users.aggregate([
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
          {InteractionsWhereUserIsLiked: {$elemMatch: {userLiking:currentUser, liked: true}}},
          {InteractionsWhereUserIsLiking: {$elemMatch: {userLiked:currentUser, liked: true}}},
          {"username" : { $not: { $eq: currentUser} }}]
      } },
    {
        $project: {
            InteractionsWhereUserIsLiked:0,
            InteractionsWhereUserIsLiking:0,
        }
    }
       
    ]).toArray()

    const userConversations = [];

    for (const user of matchedUsers) {
      const conversationQuery = {
        $or: [
          {
            userOne: currentUser,
            userTwo: user.username,
          },
          {
            userOne: user.username,
            userTwo: currentUser,
          },
        ],
      };

      const lastMessage = await messages.findOne(conversationQuery)
      console.log(lastMessage)


      if (lastMessage) {
        userConversations.push({
          otherUser: user,
          lastUpdated: lastMessage.last_updated,
        });
      }   
      
    }

    console.log("Size of userConversations array:", userConversations.length);
    // console.log(userConversations)
    
    return res.status(200).json({
      success: true,
      users: userConversations,
      message: "Matches found",
    });
  } catch (error) {
    console.error("Error while searching for matched users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

