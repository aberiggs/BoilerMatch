/*
import { connectToDatabase } from "@/lib/mongodb";
//TODO Have not tested
export default async function handler(req, res) {
  console.log("Attempting to search for potential users");

  const { database } = await connectToDatabase();
  const userCollection = database.collection("users");

  // Get the search term from the query parameter
  const searchTerm = req.query.searchTerm;

  if (!searchTerm) {
    return res.status(400).json({
      success: false,
      message: "Missing search term",
    });
  }

  const usernameRegex = new RegExp(searchTerm, "i");

  try {
    // Query the database for potential user suggestions based on the search term
    const potentialUsers = await userCollection
      .find({ username: usernameRegex })
      .limit(10) // Limit the number of suggestions returned, adjust as needed
      .toArray();

    return res.status(200).json({
      success: true,
      users: potentialUsers,
      message: "Potential users found",
    });
  } catch (error) {
    console.error("Error while searching for potential users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
*/
