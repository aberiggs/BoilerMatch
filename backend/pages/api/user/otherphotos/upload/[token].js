import { connectToDatabase } from "@/lib/mongodb" 
const { BlobServiceClient, BlockBlobClient } = require("@azure/storage-blob"); 
const jwt = require('jsonwebtoken');

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

    const tokenData = jwt.verify(req.query.token, 'MY_SECRET', (err, payload) => {
      if (err) {
          return res.status(400).json({
              success: false,
          })
      } else {
          return payload
      }
  });

  if (!tokenData) {
      return res.status(400).json({
          success: false,
      })
  }
    const username = tokenData.username

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
          

          const oldPath = image.filepath
          const filename = username + "_" + Date.now() + ".jpg"
          const rawData = fs.readFileSync(oldPath)

          const stream = intoStream(rawData)
          const streamLength = rawData.length 

          const blobService = new BlockBlobClient(process.env.AZURE_CONNECTION_STRING, "otherphotos", filename);
          
          return new Promise(() => {
            blobService.uploadStream(stream, streamLength)
                .then(async () => {
                    console.log("Upload successful")

                    const { database } = await connectToDatabase();
                    const users = database.collection("users");

                    const user = await users.findOne({username: username})

                    if (!user) {
                        return res.status(400).json({ 
                            success: false,
                            message: 'An unexpected error has occurred' 
                          });
                    }

                    const images = (user.otherphotos) ? user.otherphotos.concat([filename]) : [filename]

                    console.log("Updated photos list", images)

                    const updateDocument = {
                        $set: {
                           otherphotos: images,
                        },
                    };

                    await users.updateOne({username: username}, updateDocument)
                
                    
                    return res.status(200).json({
                      success: true,
                      message: 'Other photo uploaded',
                    })
                })
                .catch((err) => {
                    if(err) {
                        console.log("Error uploading other photo", err)
                        return res.status(500).json({ 
                          success: false,
                          message: 'Error uploading other photo' 
                        });
                    }
                })
            }).catch((err) => {
            return res.status(200).json({
              success: true,
              message: 'Other photo added',
            })
          })
      })
    }).catch((err) => {
      return res.status(500).json({ 
        success: false,
        message: 'Error uploading other photo' 
      });
    })
}
