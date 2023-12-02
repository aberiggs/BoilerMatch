import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to search for a list of post")

    /* Setup */
    const { database } = await connectToDatabase();
    const postsCollection = database.collection("posts");

    const fetchAmount = (req.query && req.query.fetchAmount) ? req.query.fetchAmount : 20

    const sort = {timestamp: -1}

    const cursor = postsCollection.find().sort(sort)
    const keywordLower = req.query.keyword.toLowerCase()

    const postList = []
    for await (const post of cursor) {
        if (postList.length >= fetchAmount) {
            break;
        }
        
        if (post.title.toLowerCase().includes(keywordLower) || post.details.toLowerCase().includes(keywordLower)) {
            postList.push(post)
        }
    }

    await cursor.close()
    
    return res.status(200).json({
        success: true,
        postList: postList
    })
}