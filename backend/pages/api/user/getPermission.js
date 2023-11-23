import { connectToDatabase } from "@/lib/mongodb";


const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");
    console.log("made it to mail")

    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Insufficient information for account creation."
        })
    }

    
    const newUser = await userCollection.findOne({username: req.body.username})
    const currentUser = await userCollection.findOne({username: req.body.currentUser})
    
        
     /* Send email confirmation */
    const jwtData = {
        email: newUser.email,
        currentUser: req.body.currentUser
    }
    const newToken = jwt.sign(jwtData, 'ourSecretKey', { expiresIn: '10m' });    
    console.log(newToken)

     transporter.sendMail({
        from: 'boilermatchproj@gmail.com',
        to: newUser.email,
        subject: 'Give rating permissions on BoilerMatch',
        text: `Hi, please visit http://localhost:3000/api/user/permit/${newToken} to allow this user to leave a rating on your account!` 
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