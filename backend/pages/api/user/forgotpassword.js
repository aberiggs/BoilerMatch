import { connectToDatabase } from "@/lib/mongodb";
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    console.log("User forgot password")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.email) {
        return res.status(400).json({
            success: false,
            message: "Missing email address."
        })
    }

    const generatedPin = Math.floor(100000 + Math.random() * 900000);

    const userLost = await userCollection.findOneAndUpdate({email: req.body.email, pin: generatedPin})
    if (!userLost) {
        return res.status(400).json({
            success: false,
            message: "Account does not exist. Please register your account."
        })
    }

    transporter.sendMail({
        from: 'boilermatchproj@gmail.com',
        to: userLost.email,
        subject: '6 Digit Verification PIN for BoilerMatch',
        text: `Hi, please enter ${generatedPin} to verify your PIN!` 
    }, function(error, info) {
        if (error) throw Error(error);
        console.log('Email Sent Successfully');
        console.log(info);
    });

    return res.status(201).json({
        success: true,
        token: newToken
    })
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "boilermatchproj@gmail.com",
        pass: "hfql cohy mzku fmym"
    }
});