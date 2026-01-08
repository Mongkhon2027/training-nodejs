require("./config/config");

// Require Router //
const express = require("express");
const cors = require("cors");
const vRouter = require("./routes/index")

// Config //
const app = express()
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!")
})

// Routers //
const apiRoutes = express.Router();
app.use('/api', apiRoutes)
apiRoutes.use('/', vRouter)

// PORT //
const server = app
  .listen(GLOBAL_VALUE.NODE_PORT)

module.exports = server;