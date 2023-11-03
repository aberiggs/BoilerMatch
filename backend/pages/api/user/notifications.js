import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to change notification preferences for user");
    

    /* Setup */
    const { database } = await connectToDatabase();

    const userCollection = database.collection("users");
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating preference."
        })
        
    }
    const updatedData =  { $set: {} };
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

    const filter = {username: tokenData.username};
    const user = await userCollection.findOne(filter);

    updatedData.$set.notificationToken = req.body.pushToken;
    if (user.recieveNotifications === undefined) {
        updatedData.$set.recieveNotifications = true;
    }
    else {
        updatedData.$set.recieveNotifications = req.body.recieveNotifications;
    }
    
    
    console.log(filter)
    console.log(updatedData)
    /* sends to db */
    var updateResult = await userCollection.updateOne(filter, updatedData);
    console.log(updateResult.modifiedCount);
    if (updateResult.modifiedCount > 0) {
        return res.status(200).json({
            success: true,
            message: 'Notification preferences updated'
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Notification preferences not updated. User not found or data unchanged.'
        });

}
}