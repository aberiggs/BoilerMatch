import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to get a list of post")

    /* Setup */
    const { database } = await connectToDatabase();
    const postsCollection = database.collection("posts");

    const fetchAmount = (req.query && req.query.fetchAmount) ? req.query.fetchAmount : 20
    const filterCategory = req.query.filterCategory;
    const query = filterCategory ? { category: filterCategory } : {};

    const sort = {timestamp: -1}

    const cursor = postsCollection.find(query).sort(sort)

    const postList = []
    for await (const post of cursor) {
        if (postList.length >= fetchAmount) {
            break;
        }
        postList.push(post)
    }

    await cursor.close()

    
    return res.status(200).json({
        success: true,
        postList: postList
    })


    
}