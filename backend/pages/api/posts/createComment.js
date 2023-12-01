import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to create a comment")

    const { database } = await connectToDatabase();
    const { ObjectId } = require("mongodb")
    const postsCollection = database.collection("posts");
    const currentDateTime = new Date()

    if (!req.body || !req.body.username || !req.body.id || !req.body.comment) {
        return res.status(400).json({
            success: false,
            message: "Your comment is empty."
        })
    }
    
    const username = req.body.username
    const post = await postsCollection.findOne({_id: new ObjectId(req.body.id)})
    const newComment = {from: username, details: req.body.comment, timestamp: currentDateTime}

    post.comments.push(newComment)

    const updateDocument = {
        $set: {
            comments: post.comments,
        },
    };

    await postsCollection.updateOne({_id: post._id}, updateDocument)

    
    return res.status(200).json({
        success: true,
        message: "Created Comment"
    })
}