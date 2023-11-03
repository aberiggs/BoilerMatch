import { connectToDatabase } from "@/lib/mongodb";
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    console.log("User submitting a lil sumn sumn")

    /* Setup */
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");

    if (!req.body || !req.body.report || !req.body.username) {
        return res.status(400).json({
            success: false,
            message: "Error happened."
        })
    }

    const userFound = await userCollection.findOne({username: req.body.username})

    const userEmail = userFound.email

    const reportString = JSON.stringify(req.body.report, null, '\n')

    transporter.sendMail({
        from: 'boilermatchproj@gmail.com',
        to: 'boilermatchproj@gmail.com',
        subject: `Report from ${userEmail}`,
        text: `${reportString}`
    }, function(error, info) {
        if (error) throw Error(error);
    });

    transporter.sendMail({
        from: 'boilermatchproj@gmail.com',
        to: `${userEmail}`,
        subject: `Thanks for your report!`,
        text: 'Hi, your report has been submitted. Thank you!'
    }, function(error, info) {
        if (error) throw Error(error);
    });

    return res.status(201).json({
        success: true,
    })
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "boilermatchproj@gmail.com",
        pass: "hfql cohy mzku fmym"
    }
});