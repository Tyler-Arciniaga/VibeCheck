require ('dotenv').config();
const express = require('express');
const spotifyPreviewFinder = require('spotify-preview-finder');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get("/get-song-preview", async (req, res) => {
    const { trackID } = req.query; //gets track id from request from frontend (search screen)

    if (!trackID){
        return res.status(400).json({error: "Track ID is required"});
    }

    try {
        const result = await spotifyPreviewFinder(trackID, 1);

        if (result.success) {
            res.json({success: true, results: result.results});
        } else {
            res.status(500).json({error: result.error});
        }
    } catch(error) {
        res.status(500).json({error: error.message})
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})