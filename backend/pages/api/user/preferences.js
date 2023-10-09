import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to add preferences for user");

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.name) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating preference."
        })
    }

    
    
    /*const existingUser = {
        email: "test@purdue.edu",
        username: "test",
        password: "a",
        verified: true
    }*/

   // const preExistingUser = await userCollection.find({email: "test@purdue.edu"});

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

    const filter = {email: "test@purdue.edu"}
    
    /* sends to db */
    await userCollection.updateOne(filter, updatePreferences);

    


}