import { connectToDatabase } from "@/lib/mongodb";
const { ObjectId } = require("mongodb")

export default async function handler(req, res) {
    console.log("Attempting to get a users posts")

    /* Setup */
    const { database } = await connectToDatabase();
    const postsCollection = database.collection("posts");

    if (!req.query || !req.query.id) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information to get a users posts."
        })
    }


    const post = await postsCollection.findOne({_id: new ObjectId(req.query.id)})


    return res.status(200).json({
        success: true,
        post: post
    })


    
}