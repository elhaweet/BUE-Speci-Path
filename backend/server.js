// Server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const initDBConnection = require("./config/db");
const recommendationRoutes = require("./routes/recommendationRoutes");

const knowledgeHubRoutes = require("./routes/knowledgeHubRoutes");
const careerRoutes = require("./routes/careerRoutes");
const authRouter = require("./routes/auth");

const bodyParser = require("body-parser");
const app = express();
dotenv.config({ path: "./config/.env" });
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

initDBConnection();


// authRouter ---------------------------------------------------------------------------------------
app.use("/", authRouter);

// recommendationRoutes -----------------------------------------------------------------------------
app.use("/", recommendationRoutes);

// careerRoutes -------------------------------------------------------------------------------------
app.use("/", careerRoutes);

// knowledgeHubRoutes -------------------------------------------------------------------------------
app.use("/", knowledgeHubRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
