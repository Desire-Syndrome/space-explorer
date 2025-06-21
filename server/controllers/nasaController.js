const axios = require("axios");
const AsyncHandler = require('express-async-handler');

const NASA_API_KEY = process.env.NASA_API_KEY;


const cacheEPIC = {};

const getEPIC = AsyncHandler(async (req, res) => {
  try {
    const { date } = req.query;

    const cacheKey = date || "today";
    if (cacheEPIC[cacheKey]) {
      return res.status(200).json(cacheEPIC[cacheKey]);
    }

    const endpoint = date ? `https://api.nasa.gov/EPIC/api/natural/date/${date}` : `https://api.nasa.gov/EPIC/api/natural`;
    const { data } = await axios.get(endpoint, { params: { api_key: process.env.NASA_API_KEY } });

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ message: "No images found for this date" });
    }

    const images = data.map(item => {
      const imageDateParts = item.date.split(" ")[0].split("-");
      const imageDate = imageDateParts.join("/");
      return {
        id: item.identifier,
        caption: item.caption,
        date: item.date,
        image: `https://epic.gsfc.nasa.gov/archive/natural/${imageDate}/png/${item.image}.png`
      };
    });
    cacheEPIC[cacheKey] = images;
    return res.status(200).json(images);
  } catch (err) {
    if (err.response && err.response.status === 429) {
      return res.status(429).json({ message: "The API is not responding or the request limit has been reached." });
    }
    return res.status(500).json({
      message: "Failed to fetch EPIC",
      error: err.message
    });
  }
});

const getEpicLatestDate = AsyncHandler(async (req, res) => {
  try {
    const { data } = await axios.get(`https://api.nasa.gov/EPIC/api/natural/all?api_key=${process.env.NASA_API_KEY}`);

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ message: "No available dates found from NASA EPIC." });
    }
    const latestDate = data[0];
    return res.status(200).json({ latestDate });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch EPIC available dates",
      error: err.message
    });
  }
});


const cacheAPOD = {};

const getAPOD = AsyncHandler(async (req, res) => {
  try {
    const { daysAgo } = req.query;

    const cacheKey = daysAgo || 0;
    if (cacheAPOD[cacheKey]) {
      return res.status(200).json(cacheAPOD[cacheKey]);
    }

    let dateParam = "";
    if (daysAgo) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - Number(daysAgo));
      dateParam = `&date=${targetDate.toISOString().split("T")[0]}`;
    }

    const { data } = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}${dateParam}`);
    cacheAPOD[cacheKey] = data;
    return res.status(200).json(data);
  } catch (err) {
    if (err.response && err.response.status === 429) {
      return res.status(429).json({ message: "The API is not responding or the request limit has been reached." });
    }
    return res.status(500).json({
      message: "Failed to fetch APOD",
      error: err.message
    });
  }
});


const cacheRovers = {};

const getRovers = AsyncHandler(async (req, res) => {
  try {
    let { sol } = req.query;

    const cacheKey = sol ?? "max";
    if (cacheRovers[cacheKey]) {
      return res.status(200).json(cacheRovers[cacheKey]);
    }

    if (!sol) {
      const roverInfoResponse = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity?api_key=${NASA_API_KEY}`);
      sol = roverInfoResponse.data.rover.max_sol;
    }

    const photosResponse = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos`, { params: { api_key: process.env.NASA_API_KEY, sol } });
    cacheRovers[cacheKey] = photosResponse.data.photos;
    return res.status(200).json(photosResponse.data.photos);
  } catch (err) {
    if (err.response && err.response.status === 429) {
      return res.status(429).json({ message: "The API is not responding or the request limit has been reached." });
    }
    return res.status(500).json({
      message: "Failed to fetch Rover photos",
      error: err.message
    });
  }
});

const getMaxSol = AsyncHandler(async (req, res) => {
  try {
    const { data } = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity?api_key=${process.env.NASA_API_KEY}`);

    const maxSol = data.rover.max_sol;
    if (typeof maxSol === "number") {
      return res.json({ max_sol: maxSol });
    } else {
      return res.status(500).json({ message: "Could not retrieve max_sol from NASA API" });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch max_sol from NASA API",
      error: err.message
    });
  }
});


module.exports = { getEPIC, getAPOD, getRovers, getMaxSol, getEpicLatestDate };