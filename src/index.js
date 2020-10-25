const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const limitter = require("express-rate-limit");

require("./db/database");

const adminRouter = require("./routes/adminRoute");
const blogRouter = require("./routes/blogRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cors client error fixed
app.use(cors());
app.use(helmet());
app.use(compression());

// rate middleware limitation
app.use(
  limitter({
    //1 hours
    windowMs: 3600000,
    // api access count
    max: 60,
    message: { message: "Too many requests, Please try again later" },
  })
);

app.use("/admin", adminRouter);
app.use(blogRouter);

app.use((req, res, next) => {
  res.status(400).send({ error: "Route not found" });
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is up to running" + process.env.PORT);
});
