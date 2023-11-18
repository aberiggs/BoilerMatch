import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to get a list of post")

    /* Setup */
    const { database } = await connectToDatabase();
    const postsCollection = database.collection("posts");
    const currentDateTime = new Date()


    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */

    console.log("req params:", req.query)

    const fetchAmount = (req.query && req.query.fetchAmount) ? req.query.fetchAmount : 20
    const filterCategory = req.query.filterCategory;
    const query = filterCategory ? { category: filterCategory } : {};

    // If there's a last loaded time, set it so we know what posts to grab we want whatever existed before that
    // TODO: THink about if it should be done this way.
    // const lastLoaded = (req.query && req.query.lastLoaded) ? req.query.lastLoaded : new Date()

    const cursor = postsCollection.find(query)

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