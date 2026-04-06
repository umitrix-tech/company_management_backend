const express = require("express");
const createError = require("http-errors");
const helmet = require("helmet");
const routes = require("./src/routes");
const hocError = require("./src/utils/hocError");
const logger = require("./src/utils/logger");
const cors = require("cors");
const app = express();
const session = require("express-session");
const passport = require("./src/utils/passport");

app.use(express.json());

app.use(helmet());
// app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: ["http://localhost:5173", "https://dev.umitrix.in", "https://umitrix.in"] }));



// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.method, "method");
  logger.info(`${req.method} ${req.url} `);
  logger.info(`body : ${JSON.stringify(req.body)}  `);
  logger.info(`params : ${JSON.stringify(req.query)}  `);
  next();
});




app.use("/api", routes);


app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use(hocError);

module.exports = app;
