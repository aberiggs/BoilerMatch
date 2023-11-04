import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Verifying User Password")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: "Missing Information."
        })
    }

    const user = await userCollection.findOne({username: req.body.username})
    
    if (user.password != req.body.password) {
        return res.status(400).json({
            success: false,
            message: "Password Does Not Match."
        })
    }

    return res.status(201).json({
        success: true,
    })
}