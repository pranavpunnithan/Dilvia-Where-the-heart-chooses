const express = require("express");
const app = express();

// 1️⃣ routes using app.get instead of router.get
app.use("/", (req, res) => {
  res.send("admin home");
});

app.get("/admin", (req, res) => {
  res.send("admin home2");
});

app.get("/delete", (req, res) => {
  res.send("admin delete");
});

app.listen(4000, () => {
  console.log("server running on port 4000");
});

