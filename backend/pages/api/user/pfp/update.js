import { connectToDatabase } from "@/lib/mongodb" 
const { BlobServiceClient, BlockBlobClient } = require("@azure/storage-blob"); 

import formidable from 'formidable';
import fs from 'fs';
import intoStream from 'into-stream';


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

    
        // Move the uploaded file to the "images" folder
        const oldPath = image.filepath
        const newPath = `./public/uploads/${image.originalFilename}`
        const rawData = fs.readFileSync(oldPath)

        const stream = intoStream(rawData)
        const streamLength = rawData.length 

        const blobService = new BlockBlobClient(process.env.AZURE_CONNECTION_STRING, "pfp", "sprocket710.jpg");

        
        blobService.uploadStream(stream, streamLength)
            .then(() => {
                console.log("Upload successful")
                return res.send("Successfully uploaded")
            })
            .catch((err) => {
                if(err) {
                    console.log("Error uploading:", err)
                    return;
                }
            })
    

        /*
        fs.writeFile(newPath, rawData, function (err) {
            if (err) console.log(err)
            return res.send("Successfully uploaded")
        })
        */
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
