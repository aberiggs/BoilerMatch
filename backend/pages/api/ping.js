// This is an example serverless function

export default function handler(req, res) {
    res.status(200).json({
        message: "Pong"
    })
}