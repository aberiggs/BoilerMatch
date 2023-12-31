import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Updating User Password")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: "Missing password."
        })
    }
    
    await userCollection.findOneAndUpdate({username: req.body.username}, {$set:{password: req.body.password}})

    return res.status(201).json({
        success: true,
    })
}