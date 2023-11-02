const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

export default async function handler(req, res) {

    await sleep(1000*60*2)
    res.status(200).json({
        message: "Pong"
    })
}