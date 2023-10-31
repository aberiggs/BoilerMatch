import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

// Fetch URI for user's images 
export default async function handler(req, res) {
    console.log("Fetching other photos")

    const { database } = await connectToDatabase();
    const users = database.collection("users");
    
    const token = req.body.token


  const tokenData = jwt.verify(token, 'MY_SECRET', (err, payload) => {
      if (err) {
          return res.status(400).json({
              success: false,
          })
      } else {
          return payload
      }
  });

if (!tokenData) {
    return res.status(400).json({
        success: false,
    })
}
  const username = tokenData.username
  console.log(username)

  const user = await users.findOne({username: username})

  if (!user) {
    console.log("user issue")
    return res.status(400).json({
        success: false,
    })
}

const otherphotos = (user.otherphotos) ? user.otherphotos : []

return res.status(200).json({
    success: true,
    photos: otherphotos
})


}