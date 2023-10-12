const jwt = require( 'jsonwebtoken');

export default async function handler(req, res) {
    if (!req.body || !req.body.token) {
        return res.status(400).json({
            success: false,
        })
    }
    const tokenDecoded = jwt.verify(req.body.token, 'MY_SECRET', (err, payload) => {
        if (err) {
            return res.status(400).json({
                success: false,
            })
        } else {
            return payload
        }
    });

    if (!tokenDecoded) {
        return res.status(400).json({
            success: false,
        })
    }

    return res.status(201).json({
        success: tokenDecoded.stayLoggedIn,
    })
}