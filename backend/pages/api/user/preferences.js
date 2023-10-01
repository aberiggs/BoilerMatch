import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to register a new user")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    if (!req.body || !req.body.name) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for updating preference."
        })
    }

    
    
    /* Create user/add to database */
    const newUser = {email: req.body.email, username: req.body.email, password: req.body.password, verified: false}
    
    const emailDomainIndex = newUser.email.lastIndexOf("@")
    if (emailDomainIndex !== -1) {
        newUser.username = newUser.email.substring(0, emailDomainIndex)
    } 
    
    
     
}
