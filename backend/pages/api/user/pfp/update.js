import { connectToDatabase } from "@/lib/mongodb" 
const { BlobServiceClient } = require("@azure/storage-blob"); 

import formidable from 'formidable';
import fs from 'fs';


export const config = {
    api: {
      bodyParser: false,
    },
  };

export default async function handler(req, res) {
    // MongoDB
    const { database } = await connectToDatabase();
    const userCollection = database.collection("users");
    // Azure Blob Storage  
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING);
    const containerName = `pfp`

    console.log("Updating pfp")
    console.log(req)
    let body = req.body

    const form = formidable({});

    form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ error: 'Error parsing form data' });
        }
    
        const image  = files.image[0];
       
        if (!image) {
          return res.status(400).json({ error: 'No image file provided' });
        }
    
        //const targetPath = `./public/images/${image[0].originalFilename}`;
    
        // Move the uploaded file to the "images" folder
        const oldPath = image.filepath
        const newPath = `./public/uploads/${image.originalFilename}`
        const rawData = fs.readFileSync(oldPath)

        fs.writeFile(newPath, rawData, function (err) {
            if (err) console.log(err)
            return res.send("Successfully uploaded")
        })
      });

    /*
    if (!body || !body.pfp) {
        return res.status(400).json({
            success: false,
            error: 'No profile picture supplied'
        })
    }
    */

    
    /* TODO: Handle JWT stuff */
    

    /* Get user to add PFP for */
    const userToUpdate = await userCollection.findOne({username: "sprocket710" })

    if (!userToUpdate) {
        return res.status(400).json({
            success: false,
            error: ("User doesn't exist: " + err)
        })
    }

    console.log("Updating:", userToUpdate)
    
    /* TODO: Handle blob uploading
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const content = "Test"
    const blobName = userToUpdate.username
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    const uploadBlobResponse = await blockBlobClient.upload(content, content.length)
    .catch(error => {
        return res.status(400).json({
            success: false,
            err: error,
            message: 'Profile picture not updated!'
        })
    })

    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId)
    */
    
    /*
    const updatedPost = {
        $set: {
            postName : body.postName,
            postSummary : body.postSummary,
            postDate : body.date
        }
    }

    const result = await collection.updateOne({ _id: postToUpdate._id }, updatedPost)            
    
    if (!result)
        return res.status(400).json({
            success: false,
            message: 'Post not updated!'
        })

    */
    

    return res.status(201).json({
        success: true,
        message: 'Profile picture updated',
    })
}
