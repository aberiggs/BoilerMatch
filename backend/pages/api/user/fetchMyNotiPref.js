import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    console.log("Attempting to fetch user noti");
    

    /* Setup */
    const { database } = await connectToDatabase();

    const interactionsCollection = database.collection("interactions");
    console.log("req.body.params", req.body.params)
    //console.log("here", req.body.params.token)
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating preference."
        })
    }
    const tokenData = jwt.verify(req.body.params.token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
            })
        } else {
            return payload
        }
    });
    console.log("tokenData", tokenData)
    console.log("b");
    if (!tokenData) {
        return res.status(400).json({
            success: false,
        })
    }
    const interaction = await interactionsCollection.findOne(
        {
            "userInteracting": tokenData.username,
            "userInteractedWith": req.body.params.userNoNoti,
        }
    );
    console.log("interactionMy", interaction);

    //const filter = {username: tokenData.username}

    //const user = await userCollection.findOne(filter);



  
    // Send the user's notification settings in the response
    return res.status(200).json({
      success: true,
      valid: interaction.allowNoti,
    });
}