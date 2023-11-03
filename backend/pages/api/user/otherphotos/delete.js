import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

// Fetch URI for user's images 
export default async function handler(req, res) {
    console.log("Deleting photos")

    const { database } = await connectToDatabase();
    const users = database.collection("users");
    
    if (!req.body || !req.body.token || !req.body.photoToDelete) {
        console.log("Not enough info")
        return res.status(400).json({
            success: false,
        })
    }

    const tokenData = jwt.verify(req.body.token, 'MY_SECRET', (err, payload) => {
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

    const user = await users.findOne({username: username})

    const otherphotos = (user && user.otherphotos) ? user.otherphotos : []

    console.log(otherphotos)

    const newOtherphotos = otherphotos.filter(e => e !== req.body.photoToDelete)
    console.log(newOtherphotos)

    const updateDocument = {
        $set: {
           otherphotos: newOtherphotos,
        },
    };

    await users.updateOne({username: username}, updateDocument)

    return res.status(200).json({
        success: true,
    })


}