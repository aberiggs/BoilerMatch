import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {

    const jwtData = jwt.verify(req.query.token, 'ourSecretKey', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Account could not be verified. Link may be invalid or expired."
            })
        } else {
            return payload
        }
    })
    

    if (!jwtData) {
        return res.status(400).json({
            success: false,
            message: "Account could not be verified. Link may be invalid or expired."
        })
    }

    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    const updatePermissionStatus = {
        $push: {
            permissions: jwtData.currentUser
        },
    }

    await userCollection.updateOne({email: jwtData.email}, updatePermissionStatus).catch(err => {
        return res.status(400).json({
            success: false,
            message: "An unexpected error occurred while verifying the account."
        })
    })
    
    return res.status(201).json({
        success: true,
        message: "Your account has been verified!"
    })

} 