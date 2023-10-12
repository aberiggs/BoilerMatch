import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to add information for user");

    // setup
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    // if request doesn't have any information
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating information."
        })
    }

    // information
    const information = req.body.information

    // update information
    const updateInformation = {
        $set: {
            information: information
        }
    }

    const filter = {username: "sprocket710"}
    
    // send to DB
    await userCollection.updateOne(filter, updateInformation);

    return res.status(200).json({
        success: true,
        message: 'Information updated'
    })



}