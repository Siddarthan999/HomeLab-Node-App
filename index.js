const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("🚀 DevOps CI/CD Pipeline is Working!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

