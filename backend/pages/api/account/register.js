import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
    console.log("Attempting to register a new user")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    /* Check that request body is valid. This shouldn't happen, as there is validation in frontend, so we will throw an error if it occurs. */
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for account creation."
        })
    }

    /* See if an account with that email already exist */
    const preExistingUser = await userCollection.findOne({email: req.body.email})
    if (preExistingUser) {
        return res.status(400).json({
            success: false,
            message: "An account with that email already exists."
        })
    }

    /* TODO: Send email confirmation   -   Note: Check out setTimeout() */
    
    /* Create user/add to database */
    const newUser = {email: req.body.email, username: req.body.email, password: req.body.password}
    
    const emailDomainIndex = newUser.email.lastIndexOf("@")
    if (emailDomainIndex !== -1) {
        newUser.username = newUser.email.substring(0, emailDomainIndex)
    } 
    

    userCollection.insertOne(newUser).catch(err => {
        return res.status(400).json({
            success: false,
            message: "An unexpected error occurred while creating the account."
        })
    })


    /* Send back success response if all is well */

    return res.status(201).json({
        success: true,
        message: "Your account has been created!"
    })
}
