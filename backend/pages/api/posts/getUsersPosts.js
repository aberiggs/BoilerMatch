import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to get a users posts")

    /* Setup */
    const { database } = await connectToDatabase();
    const postsCollection = database.collection("posts");
    const currentDateTime = new Date()

    if (!req.query || !req.query.user) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information to get a users posts."
        })
    }

    const user = req.query.user
    const query = {user: user }

    const sort = {timestamp: -1}

    const postList = postsCollection.find(query).sort(sort).toArray()

    await cursor.close()

    return res.status(200).json({
        success: true,
        postList: postList
    })


    
}