import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to add housing information for user");

    // setup
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    // if request doesn't have any information
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating housing information."
        })
    }

    // information
    const housingInformation = req.body.housingInformation

    // update information
    const updateHousingInformation = {
        $set: {
            housingInformation: housingInformation
        }
    }

    const filter = {username: "sprocket710"}
    
    // send to DB
    await userCollection.updateOne(filter, updateHousingInformation);

    return res.status(200).json({
        success: true,
        message: 'Housing Information updated'
    })


}