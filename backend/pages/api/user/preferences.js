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

    
    
    const existingUser = {
        email: "test@purdue.edu",
        username: "test",
        password: "a",
        verified: true
    }

    const preferences = {
        gender: req.body.gender, 
        bedtime: req.body.bedtime, 
        guest: req.body.guest, 
        noise: req.body.noise
    }

    existingUser

    


}
