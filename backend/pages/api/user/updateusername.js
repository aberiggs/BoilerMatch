import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Updating User Username")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.email) {
        return res.status(400).json({
            success: false,
            message: "Missing email."
        })
    }

    const emailDomainIndex = req.body.email.lastIndexOf("@")
    if (emailDomainIndex !== -1) {
        const newUsername = req.body.email.substring(0, emailDomainIndex)
        await userCollection.findOneAndUpdate({username: req.body.username}, {$set:{email: req.body.email, username: newUsername}})
    }

    return res.status(201).json({
        success: true,
    })
}