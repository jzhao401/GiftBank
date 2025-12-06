const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, "build")));

// Handle all routes - return index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Root route
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(9000, () => {
  console.log("Server is running on http://localhost:9000");
});
