import { connectToDatabase } from "@/lib/mongodb";
import { Db,ObjectId} from "mongodb";
const jwt = require( 'jsonwebtoken');
const Spearman = require('spearman-rho');
const { shuffle } = require('lodash');

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


  try {
  const userInfo = await users.findOne({username: currentUser})
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
          {"information.gender": userInfo.information.gender},
          {"information.yearForRoommate": userInfo.information.yearForRoommate},
            {"discoverable": true},
            gradYearFilter !== null ? { "information.graduation": gradYearFilter } : {},
            majorFilter !== "" ? { "information.major": { $regex: new RegExp(majorFilter, 'i') } } : {},
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
      size: 30
    }},
    ]).toArray()
    
    const ranked_objects= Object.values(userInfo.rankings)

    const current_user_rankings = ranked_objects.map((value,index, array) => 
      array.indexOf(value));
    const usersWithCoefficients= []
    for (const user of potentialUsers){
      const user_rankings = Object.values(user.rankings).map((value) => ranked_objects.indexOf(value));
      const spearman = new Spearman(current_user_rankings, user_rankings);
      await spearman.calc()
      .then(value => {
        console.log(ranked_objects); console.log(Object.values(user.rankings));
        console.log("similarity score:" + value)
        usersWithCoefficients.push({user,value})})
      .catch(err => console.error(err));
    }

     usersWithCoefficients.sort((a, b) =>{
      return b.value - a.value;
  });
 
  const top5Users = usersWithCoefficients.slice(0, 5);
  
  console.log(top5Users)
  const usersInfo = shuffle(top5Users.map(item => item.user));

    return res.status(200).json({
      success: true,
      users: usersInfo,
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