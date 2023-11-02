import { connectToDatabase } from "@/lib/mongodb";


const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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
    if (preExistingUser && preExistingUser.verified !== false) {
        return res.status(400).json({
            success: false,
            message: "An account with that email already exists."
        })
    }
    /* Create user/add to database */
    const newUser = {email: req.body.email, username: req.body.email, password: req.body.password, verified: false, notificationToken: null}
    
    const emailDomainIndex = newUser.email.lastIndexOf("@")
    if (emailDomainIndex !== -1) {
        newUser.username = newUser.email.substring(0, emailDomainIndex)
    } 
    
    if (!preExistingUser) {
        userCollection.insertOne(newUser).catch(err => {
            return res.status(400).json({
                success: false,
                message: "An unexpected error occurred while creating the account."
            })
        })
    }
    
     /* Send email confirmation */
    const jwtData = {
        email: newUser.email
    }
    const newToken = jwt.sign(jwtData, 'ourSecretKey', { expiresIn: '10m' });    
    console.log(newToken)

     transporter.sendMail({
        from: 'boilermatchproj@gmail.com',
        to: newUser.email,
        subject: 'Verify account for BoilerMatch',
        text: `Hi, please visit http://localhost:3000/api/user/verify/${newToken} to verify your account!` 
    }, function(error, info) {
        if (error) throw Error(error);
        console.log('Email Sent Successfully');
        console.log(info);
    });


    /* Send back success response if all is well */
    return res.status(201).json({
        success: true,
        message: "Your account has been created!"
    })
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "boilermatchproj@gmail.com",
        pass: "hfql cohy mzku fmym"
    }
});
  
  
// TODO: Token generation should probably be encapsulated somewhere else
const token = (tokenData) => { 
}