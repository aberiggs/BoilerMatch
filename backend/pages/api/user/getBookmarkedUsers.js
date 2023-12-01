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
  try {
    const bookmarkedUsers = await users.aggregate([
      {
        $match: {
            "discoverable": true,
            "username" : { $nin: excludedUsers },
            ...(gradYearFilter !== null && { "information.graduation": gradYearFilter }),
           ...(majorFilter !== "" && { "information.major": { $regex: new RegExp(majorFilter, 'i') } }),
        }
    },
    {
        $lookup: {
            from: "interactions",
            let: { username: "$username" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$userInteracting", currentUser] },
                                { $eq: ["$userInteractedWith", "$$username"] },
                                {  $eq: ["$bookmarked", true ]},
                                {$ne: ["$didBlocking", true]},
                                {$ne: ["$gotBlocked", true]},
                            ]
                        }
                    }
                }
            ],
            as: "interaction"
        }
    },
    {
        $match: {
          interaction: { $size: 1}
        }
    },
    {$sample: {
      size: 5
    }}

    ]).toArray()
    //console.log(bookmarkedUsers)
   
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

