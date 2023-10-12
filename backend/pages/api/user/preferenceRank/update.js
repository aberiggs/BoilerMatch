import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to rank preferences for user");

    /* Setup */
    const { database } = await connectToDatabase();

    const userCollection = database.collection("users");


    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating preference."
        })
        
    }

    

    /* define preferences */
    const rankings = {
        rank1: req.body.rank1, 
        rank2: req.body.rank2, 
        rank3: req.body.rank3, 
        rank4: req.body.rank4,
        rank5: req.body.rank5

    }

    //preExistingUser.preferences = preferences;

    /* updates prefs rankings */
    const updateRankings = {
        $set: {
            rankings: rankings
        }
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


    
    /* sends to db */
    await userCollection.updateOne(filter, updateRankings);


    return res.status(200).json({
        success: true,
        message: 'Preference ranks updated'
    })
}
