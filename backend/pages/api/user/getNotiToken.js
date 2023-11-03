import { connectToDatabase } from "@/lib/mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req,res) {
    console.log("Attempting to get token");
    

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");
    const user = await userCollection.findOne({ username: req.body.name });
  if (user && user.notificationToken) {
    res.status(200).json({ notificationToken: user.notificationToken });
  } else {
    // Handle the case where the user or their notificationToken is not found
    res.status(404).json({ error: "User or notificationToken not found" });
  }
}