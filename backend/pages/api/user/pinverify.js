import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("User Verifying PIN")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.pin) {
        return res.status(400).json({
            success: false,
            message: "Missing PIN."
        })
    }

    const userVerifying = await userCollection.findOne({email: req.body.email})
    
    if (userVerifying.pin != req.body.pin) {
        return res.status(400).json({
            success: false,
            message: "PIN does not match. Please try again"
        })
    }

    return res.status(201).json({
        success: true,
    })
}