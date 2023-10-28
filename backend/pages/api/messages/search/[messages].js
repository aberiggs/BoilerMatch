// import { connectToDatabase } from "@/lib/mongodb";

// export default async function handler(req, res) {
//     console.log("Attempting to search for the message")

//     const { database } = await connectToDatabase();
//     const userCollection = database.collection("users");
//     if (!req.query.user) {
//        return res.status(400).json({
//             success: false,
//             message: "Missing username"
//         })
//     }
//     const usernameRegex = new RegExp(req.query.user, "i");
//     const users = await userCollection.find({username:usernameRegex }).toArray()
//     if (users.length == 0) {
//         return res.status(400).json({
//             success: false,
//             message: "No users found"
//         })
        
//     } else {
//         return res.status(200).json({
//             success: true,
//             users: users,
//             message: "users found"
//         })
//     }
  


// }