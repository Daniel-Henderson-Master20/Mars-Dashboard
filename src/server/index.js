require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.listen(port, () => console.log(`Mars Rover Dashboard app listening on port ${port}!`))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async(req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/rovers/:rover', async(req, res) => {
try {
    const { rover } = req.params
    let roverDetails = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?max_date&api_key=${process.env.API_KEY}`)
        .then(res => res.json())
    res.send({ roverDetails })
} catch (err) {
    console.log('error:', err);
}
})
)

// Rovers
// app.get('/rovers/spirit', async(req, res) => {
//     try {
//         const { rover } = req.params;
//         let image = await fetch(`
//         https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=1000&api_key=${process.env.API_KEY}`)
//             .then(res => res.json())
//         res.send({ image })
//     } catch (err) {
//         console.log('error:', err);
//     }
// })