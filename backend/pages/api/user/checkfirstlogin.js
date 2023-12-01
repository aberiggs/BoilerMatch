import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Checking for first login")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.username) {
        return res.status(400).json({
            success: false,
        })
    }

    const user = await userCollection.findOne({username: req.body.username})
    if (!user) {
        return res.status(400).json({
            success: false,
        })
    }

    if (!user.information && !user.housingInformaton && !user.preferences && !user.rankings) {
        return res.status(201).json({
            first: true,
        })
    }

    return res.status(201).json({
        first: false,
    })
}