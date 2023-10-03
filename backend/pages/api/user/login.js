import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to sign in the user")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: "Missing login information."
        })
    }

    const userLoggingIn = await userCollection.findOne({username: req.body.username})
    if (userLoggingIn && userLoggingIn.password !== req.body.password) {
        return res.status(400).json({
            success: false,
            message: "Incorrect password. Try again."
        })
    } else if (userLoggingIn && userLoggingIn.verified === false) {
        return res.status(400).json({
            success: false,
            message: "Account not verified. Please verify your account."
        })
    } else if (!userLoggingIn) {
        return res.status(400).json({
            success: false,
            message: "Account does not exist. Please register your account."
        })
    }

    const jwtData = {
        username: userLoggingIn.username
    }

    const newToken = jwt.sign(jwtData, 'ourSecretKey', {});

    return res.status(201).json({
        success: true,
        token: newToken
    })
}