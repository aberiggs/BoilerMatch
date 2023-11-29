import { connectToDatabase } from "@/lib/mongodb";


const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");
    console.log("MADE IT TO CONFIRMATION MAIL")

    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Error."
        })
    }

    
    const newUser = await userCollection.findOne({username: req.body.username})
    const currentUser = await userCollection.findOne({username: req.body.currentUser})
    
        
     /* Send email confirmation */
    const jwtData = {
        email: newUser.email,
        currentUser: req.body.currentUser
    }
    const newToken = jwt.sign(jwtData, 'ourSecretKey', { expiresIn: '30m' });    
    console.log(newToken)

     transporter.sendMail({
        from: 'boilermatchproj@gmail.com',
        to: newUser.email,
        subject: 'New rating on your account!',
        text: `Hi, we are emailing you to let you know that a user has left a rating on your account.` 
    }, function(error, info) {
        if (error) throw Error(error);
        console.log('Email Sent Successfully');
        console.log(info);
    });


    /* Send back success response if all is well */
    return res.status(201).json({
        success: true,
        message: "Email sent"
    })
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "boilermatchproj@gmail.com",
        pass: "hfql cohy mzku fmym"
    }
});
  
  