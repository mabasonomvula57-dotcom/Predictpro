const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_FOOTBALL_KEY;
const API_URL = "https://v3.football.api-sports.io";

app.get("/", (req, res) => {
  res.json({
    app: "PredictPro API",
    status: "online"
  });
});

app.get("/api/fixtures", async (req, res) => {
  try {
    const { date, league, season } = req.query;

    const params = new URLSearchParams();

    if (date) params.append("date", date);
    if (league) params.append("league", league);
    if (season) params.append("season", season);

    const response = await fetch(
      `${API_URL}/fixtures?${params.toString()}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Could not retrieve football data"
    });
  }
});

app.get("/api/prediction/:fixtureId", async (req, res) => {
  try {
    const { fixtureId } = req.params;

    const response = await fetch(
      `${API_URL}/predictions?fixture=${fixtureId}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Could not retrieve prediction"
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`PredictPro API running on port ${PORT}`);
});
