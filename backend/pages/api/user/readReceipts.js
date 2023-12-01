import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to change read receipt preferences for user - readReceipts");

    /* Setup */
    const { database } = await connectToDatabase();

    const userCollection = database.collection("users");
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating read receipt preferences."
        });
    }

    const updatedData = { $set: {} };
    const tokenData = jwt.verify(req.body.token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
            });
        } else {
            return payload;
        }
    });

    if (!tokenData) {
        return res.status(400).json({
            success: false,
        });
    }

    const filter = { username: tokenData.username };
    const user = await userCollection.findOne(filter);

    if (user.readReceiptsEnabled === null || user.readReceiptsEnabled === undefined) {
        updatedData.$set.readReceiptsEnabled = true;
    }
    else {
        console.log("in else");
        console.log("userREcieve", user.readReceiptsEnabled);
        updatedData.$set.readReceiptsEnabled = user.readReceiptsEnabled;
    }

    /* Send to db */
    var updateResult = await userCollection.updateOne(filter, updatedData);
    console.log(updateResult.modifiedCount);
    if (updateResult.modifiedCount > 0) {
        return res.status(200).json({
            success: true,
            message: 'Read receipt preferences updated'
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Read receipt preferences not updated. User not found or data unchanged.'
        });
    }
}
