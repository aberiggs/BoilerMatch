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
    const form = formidable({});



    return new Promise(() => {
      form.parse(req, (err, fields, files) => {
          if (err) {
            return res.status(500).json({ 
              success: false,
              message: 'Error parsing form data' });
          }
      
          const image  = files.image[0];
          
          if (!image) {
            return res.status(400).json({
              success: false,
              message: 'No image file provided' 
            });
          }

          const username = "sprocket710"
      
          // Move the uploaded file to the "images" folder
          const oldPath = image.filepath
          const filename = username + ".jpg"
          const rawData = fs.readFileSync(oldPath)

          const stream = intoStream(rawData)
          const streamLength = rawData.length 

          const blobService = new BlockBlobClient(process.env.AZURE_CONNECTION_STRING, "pfp", filename);
          
          return new Promise(() => {
            blobService.uploadStream(stream, streamLength)
                .then(() => {
                    console.log("Upload successful")
                    
                    return res.status(200).json({
                      success: true,
                      message: 'Profile picture updated',
                    })
                })
                .catch((err) => {
                    if(err) {
                        console.log("Error uploading pfp:", err)
                        return res.status(500).json({ 
                          success: false,
                          message: 'Error uploading profile picture' 
                        });
                    }
                })
            }).catch(err => {
            return res.status(200).json({
              success: true,
              message: 'Profile picture updated',
            })
          })
          
      })
    }).catch(err => {
      return res.status(500).json({ 
        success: false,
        message: 'Error uploading profile picture' 
      });
    })
}
