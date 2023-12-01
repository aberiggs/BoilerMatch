import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to change read receipt settings for user - readReceiptsSettings");
    

    /* Setup */
    const { database } = await connectToDatabase();

    const userCollection = database.collection("users");
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating read receipts."
        })
    }

    console.log("DOES IT GET HERE 1")
    const updatedData = {
        $set: {
            readReceiptsEnabled: req.body.readReceiptsEnabled
        }
    }
    console.log("UPDATED DATA", updatedData)
    const tokenData = jwt.verify(req.body.token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
            })
        } else {
            return payload
        }
    });

    if (!tokenData) {
        return res.status(400).json({
            success: false,
        })
    }

    const filter = {username: tokenData.username}

    console.log(updatedData)
    /* sends to db */
    var updateResult = await userCollection.updateOne(filter, updatedData);
    console.log(updateResult);
    if (updateResult) {
        return res.status(200).json({
            success: true,
            message: 'Read Receipt preferences updated'
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Read Receipt preferences not updated. User not found or data unchanged.'
        });

}
}