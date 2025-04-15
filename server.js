// server.js
const express = require("express");
const sslRedirect = require("heroku-ssl-redirect");
const path = require("path");

const app = express();

// Enable SSL redirect
app.use(sslRedirect());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
