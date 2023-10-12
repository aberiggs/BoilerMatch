import { connectToDatabase } from "@/lib/mongodb";

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

    const filter = {email: "test@purdue.edu"}


    
    /* sends to db */
    await userCollection.updateOne(filter, updateRankings);



}
