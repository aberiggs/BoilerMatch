import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to delete a comment")

    const { database } = await connectToDatabase();
    const { ObjectId } = require("mongodb")
    const postsCollection = database.collection("posts");

    if (!req.body || !req.body.username || !req.body.id || !req.body.details) {
        return res.status(400).json({
            success: false,
            message: "Your comment is empty."
        })
    }
    
    const username = req.body.username
    const post = await postsCollection.findOne({_id: new ObjectId(req.body.id)})
    const comments = post.comments

    for (var i = 0; i < comments.length; i++)
        if (comments[i].from == username && comments[i].details == req.body.details) {
            comments.splice(i,1);
            break;
        }

    const updateDocument = {
        $set: {
            comments: comments,
        },
    };

    await postsCollection.updateOne({_id: post._id}, updateDocument)

    
    return res.status(200).json({
        success: true,
        message: "Created Comment"
    })
}