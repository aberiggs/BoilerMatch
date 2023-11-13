import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to create a post")

    /* Setup */
    const { database } = await connectToDatabase();
    const postsCollection = database.collection("posts");
    const currentDateTime = new Date()


    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    console.log("body ", req.body)
    console.log("token ", req.body.token)
    console.log("token ", req.body.category)
    console.log("token ", req.body.title)
    console.log("token ", req.body.details)


    if (!req.body || !req.body.token || !req.body.category || !req.body.title || !req.body.details) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information to create post."
        })
    }

    /* Authenticate the user */
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
    
    const username = tokenData.username

    const newPost = {user: username, timestamp: currentDateTime, category: req.body.category, title: req.body.title, details: req.body.details }
    await postsCollection.insertOne(newPost).catch(err => {
        return res.status(400).json({
            success: false,
            message: "An unexpected error occurred while creating a new post"
        })
    })

    
    return res.status(200).json({
        success: true,
        message: "Created post"
    })


    
}