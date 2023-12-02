import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to get a users posts")

    /* Setup */
    const { database } = await connectToDatabase();
    const postsCollection = database.collection("posts");

    if (!req.query || !req.query.user) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information to get a users posts."
        })
    }

    const user = req.query.user
    console.log("Querying posts for", user)
    const query = {user: user }

    const sort = {timestamp: -1}

    const postList = await postsCollection.find(query).sort(sort).toArray()
    console.log(postList)


    return res.status(200).json({
        success: true,
        postList: postList
    })


    
}