require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("node:dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false })); // Para leer los datos del formulario

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const urlDatabase = {};
let idCounter = 1;

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;

  try {
    const urlObj = new URL(originalUrl);
    dns.lookup(urlObj.hostname, (err) => {
      if (err) {
        return res.json({ error: "invalid url" });
      }

      const shortUrl = idCounter++;
      urlDatabase[shortUrl] = originalUrl;

      res.json({ original_url: originalUrl, short_url: shortUrl });
    });
  } catch {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  const originalUrl = urlDatabase[req.params.id];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "No short URL found" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
