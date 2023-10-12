import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to add preferences for user");

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
    const preferences = {
        gender: req.body.gender, 
        bedtime: req.body.bedtime, 
        guest: req.body.guest, 
        noise: req.body.noise
    }

    //preExistingUser.preferences = preferences;

    /* updates prefs */
    const updatePreferences = {
        $set: {
            preferences: preferences
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
    await userCollection.updateOne(filter, updatePreferences);



}
