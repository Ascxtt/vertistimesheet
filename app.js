const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const port = process.env.PORT || 5000;

const Client = require("./models/Client");
const User = require("./models/User");

// db config
const db = require("./config/database");

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// load routes
const users = require("./routes/users");
const timesheets = require("./routes/timesheets");

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose
  .connect(db.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// express handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      areEqual: function(value1, value2, options) {
        if (value1 && value2) {
          if (value1.toString() == value2.toString()) {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        }
      }
    }
  })
);
app.set("view engine", "handlebars");



// mongoose middleware

// passport config
require("./config/passport")(passport);

// body parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// express session midleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash middleware
app.use(flash());

// method override middleware
app.use(methodOverride("_method"));

//create client
app.use((req, res, next) => {
  const client = new Client({
    name: 'Dixons Accounting Firm',
    manager: {
      firstName: 'Danea',
      lastName: 'Dixon',
      position: 'CEO'
    }
  })
  client.save()
    .then(client => {
      console.log(client)
      console.log('Test')
    })
    .catch(err => console.log(err))
  next();
});

//create user
     
// app.use((req, res, next) => {
//   const user = new User({
//     firstName: "Romaine",
//     lastName: "Ascott",
//     email: "romaine.ascott@gmail.com",
//     password: "123456"
//   });

//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) throw err;
//       user.password = hash;
//       user
//         .save()
//         .then(user => {
//           console.log(user);
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     });
//   });
//   next();
// });

// global variables
app.use(function(req, res, next) {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// index route
app.get("/", (req, res) => {
  res.render("index");
});

// users routes
app.use("/users", users);
// timesheets routes
app.use("/timesheets", timesheets);
// invalid route redirect
app.get("/*", function(req, res) {
  res.redirect("/");
});

// start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
