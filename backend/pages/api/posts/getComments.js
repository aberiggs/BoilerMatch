import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
const pollingRate = 2 // Seconds

export default async function handler(req, res) {
    console.log("Attempting to get a comment section")

    /* Setup */
    const { database } = await connectToDatabase();
    const { ObjectId } = require("mongodb")
    const postsCollection = database.collection("posts");

    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information to send message."
        })
    }

    const post = await postsCollection.findOne({_id: new ObjectId(req.body.id)})
    const comments = post.comments

    return res.status(200).json({
        success: true,
        comments: comments
    })
}