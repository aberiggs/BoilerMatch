import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

// Fetch URI for user's images 
export default async function handler(req, res) {
    console.log("Fetching other photos")

    const { database } = await connectToDatabase();
    const users = database.collection("users");
    
    if (!req.body || !req.body.username) {
        console.log("Not enough info")
        return res.status(400).json({
            success: false,
        })
    }

    const username = req.body.username

    const user = await users.findOne({username: username})

    const otherphotos = (user && user.otherphotos) ? user.otherphotos : []

    return res.status(200).json({
        success: true,
        photos: otherphotos
    })


}