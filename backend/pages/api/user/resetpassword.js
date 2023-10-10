import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Resetting User Password")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: "Missing password."
        })
    }

    await userCollection.findOneAndUpdate({email: req.body.email}, {$set:{password: req.body.password}})

    return res.status(201).json({
        success: true,
    })
}