const jwt = require( 'jsonwebtoken');
import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.token) {
        return res.status(400).json({
            success: false,
        })
    }

    // Decode token
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

    const filter = {username: tokenData.username}
    
    // Get user from DB
    const user = await userCollection.findOne(filter);

    if (!user || !user.preferenceRank) {
        return res.status(400).json({
            success: false,
        })
    }

    return res.status(200).json({
        success: true,
        preferenceRank: user.preferenceRank,
    })

    
}