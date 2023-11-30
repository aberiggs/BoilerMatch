import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to modify vote")

    const { database } = await connectToDatabase();
    const { ObjectId } = require("mongodb")
    const postsCollection = database.collection("posts");
    const currentDateTime = new Date()

    if (!req.body || !req.body.token || !req.body.id || req.body.vote === null) {
        return res.status(400).json({
            success: false,
            message: "Insufficient amount of info to modify a vote"
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

    const post = await postsCollection.findOne({_id: new ObjectId(req.body.id)})

    let newUpvoteUsers = post.upvoteUsers ? post.upvoteUsers : []
    let newDownvoteUsers = post.downvoteUsers ? post.downvoteUsers : []
    let newUpvoteCount = post.upvoteCount ? post.upvoteCount : 0
    
    // Clear current vote if one exists
    if (newUpvoteUsers.includes(username)) {
        newUpvoteUsers = newUpvoteUsers.filter(e => e !== username)
        newUpvoteCount--
    } 

    if (newDownvoteUsers.includes(username)) {
        newDownvoteUsers = newDownvoteUsers.filter(e => e !== username)
        newUpvoteCount++
    }

    // Apply new vote
    if (req.body.vote === 1) {
        newUpvoteUsers.push(username)
        newUpvoteCount++
    } else if (req.body.vote === -1) {
        newDownvoteUsers.push(username)
        newUpvoteCount--
    }

    const updateDocument = {
        $set: {
            upvoteUsers: newUpvoteUsers,
            downvoteUsers: newDownvoteUsers,
            upvoteCount: newUpvoteCount,
        },
    };

    await postsCollection.updateOne({_id: post._id}, updateDocument)

    
    return res.status(200).json({
        success: true,
        message: "Updated vote",
        upvoteCount: newUpvoteCount
    })
}