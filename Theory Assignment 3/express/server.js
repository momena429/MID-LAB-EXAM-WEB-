const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Use express-ejs-layouts for layout support
app.use(expressLayouts);

// Set the default layout file
app.set("layout", "layouts/main");

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to My Landing Page" });
});

// Define routes
app.get("/about", (req, res) => {
  res.render("about", { title: "Welcome to My About Page" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
