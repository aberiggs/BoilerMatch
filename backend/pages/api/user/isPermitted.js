import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    const { database } = await connectToDatabase();
    const users = database.collection("users");

    // console.log("BODY: ", req.body);
     console.log("QUERY: ", req.query);


    const selectedUser = await users.findOne({username: req.query.selectedUser});
    const token = req.query.token;
    const currentUser = jwt.verify(token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
            })
        } else {
            return payload.username
        }
    });

    console.log("Selected user: " , selectedUser)
    console.log("Current user: ", currentUser)
    console.log("isArray : ", Array.isArray(selectedUser.permissions));

    if (selectedUser && Array.isArray(selectedUser.permissions)) {
        const userPermissions = selectedUser.permissions;
        console.log("permissions: ", userPermissions);
        const isCurrentUserPermitted = userPermissions.includes(currentUser);
    
        if (isCurrentUserPermitted) {
            // currentUser is found in permissions array
            return res.status(200).json({ hasPermission: true });
        } else {
            // currentUser is not found in permissions array
            return res.status(200).json({ hasPermission: false });
        }
    } else {
        // Handle scenarios where selectedUser or permissions array is missing or invalid
        return res.status(200).json({ hasPermission: false });
    }



}