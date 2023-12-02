import { connectToDatabase } from "@/lib/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to delete a post")

    /* Setup */
    const { database } = await connectToDatabase();
    const postsCollection = database.collection("posts");

    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    if (!req.query || !req.query.token || !req.query.user || !req.query.timestamp) {
        console.log("NOOOOOOO")
        return res.status(400).json({
            success: false,
            message: "Insufficient information to delete post."
        })
    }


    console.log("QUERY: ", req.query)
    /* Authenticate the user */
    const tokenData = jwt.verify(req.query.token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Token verification failed:",
                error: err
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

    /* Look for a conversation between the two users */
    const formattedTimestamp = new Date(req.query.timestamp)
    const query = {user: req.query.user, timestamp: formattedTimestamp}
    let deletePost = await postsCollection.findOne(query)

    if (!deletePost) {
        return res.status(404).json({
            success: false,
            message: "No such post"
        })
    }

    // delete the conversation
    console.log("ID              ", deletePost._id)
    const deleteResult = await postsCollection.deleteOne({ _id: deletePost._id });

    if (deleteResult.deletedCount === 1) {
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } else {
        return res.status(500).json({
            success: false,
            message: "Failed to delete the post"
        });
    }

}