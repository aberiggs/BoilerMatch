import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("fetching discoverability")

    const { database } = await connectToDatabase();
    const users = database.collection("users");
    


    const token = req.body.token


  const currentUser= jwt.verify(token, 'MY_SECRET', (err, payload) => {
      if (err) {
          return res.status(400).json({
              success: false,
          })
      } else {
          return payload.username
      }
  });
console.log(currentUser)
    try {
    // Query the database for potential user suggestions based on the search term
    const user = await users.findOne(
        {username: currentUser},
        {_id: 0,discoverable: 1}
        )
    return res.status(200).json({
      success: true,
      discoverability: user.discoverable,
      message: "Flipped discoverability",
    });
  } catch (error) {
    console.error("Error while flipping discoverability:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}