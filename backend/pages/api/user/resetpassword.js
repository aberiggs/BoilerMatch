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

    // TODO: need to use props
    const userResetting = await userCollection.findOneAndUpdate()

    return res.status(201).json({
        success: true,
    })
}