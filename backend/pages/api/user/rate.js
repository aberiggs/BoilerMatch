import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to add ratings for user");

    /* Setup */
    const { database } = await connectToDatabase();

    const userCollection = database.collection("users");


    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating ratings."
        })
        
    }

    const username = {
        username: req.body.username
    }

    console.log("USERNAME: " , username)



    /* define preferences */
    const ratings = {
        bedtime: req.body.bedtime, 
        guest: req.body.guest, 
        clean: req.body.clean,
        noise: req.body.noise
    }

    //preExistingUser.preferences = preferences;

    /* updates prefs */
    const updateRatings = {
        $push: {
            ratings: ratings
        }
    }

    // Decode token
    const tokenData = jwt.verify(req.body.token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Error validating auth token"
            })
        } else {
            return payload
        }
    });

    if (!tokenData) {
        return res.status(400).json({
            success: false,
            message: "No token data found"
        })
    }

    const filter = {username: req.body.username}
    console.log("Username: ", tokenData.username);


    
    /* sends to db */
    await userCollection.updateOne(filter, updateRatings);

    return res.status(200).json({
        success: true,
        message: 'Ratings updated'
    })
}
