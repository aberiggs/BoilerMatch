import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("User deleting account")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: "Username or password field empty!"
        })
    }

    const user = await userCollection.findOne({username: req.body.username})
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Email does not exist. Please register your account."
        })
    } else {
        if (user.password != req.body.password) {
            return res.status(400).json({
                success: false,
                message: "Password does not match. Please check your account."
            })
        }
    }

    await userCollection.deleteOne({username: req.body.username})

    return res.status(201).json({
        success: true,
    })
}