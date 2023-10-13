const jwt = require( 'jsonwebtoken');
import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Getting pref rank")
    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.token) {
        return res.status(400).json({
            success: false,
            message: "No body"
        })
    }

    // Decode token
    const tokenData = jwt.verify(req.body.token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Token invalid"
            })
        } else {
            return payload
        }
    });

    if (!tokenData) {
        return res.status(400).json({
            success: false,
            message: "Missing token data"
        })
    }

    const filter = {username: tokenData.username}
    
    // Get user from DB
    const user = await userCollection.findOne(filter);

    if (!user || !user.rankings) {
        return res.status(400).json({
            success: false,
            message: "No user or preference rank"
        })
    }

    return res.status(200).json({
        success: true,
        rankings: user.rankings,
    })

    
}