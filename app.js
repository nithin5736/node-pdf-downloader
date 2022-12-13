const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
// const pdf = require("pdf-creator-node");
const pdf = require("html-pdf");
const ejs = require("ejs");
const path = require("path");
const User = require("./models/user");
const options = require("./helpers/options");

require("dotenv").config();

const app = express();

mongoose
  .connect(
    "mongodb+srv://sainithin:gubba12345@stickmandb.2ho4mxc.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Failed to connect to database");
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

let username;

app.post("/add", async (req, res) => {
  const { name, nums } = req.body;
  let t = 10001;
  const arr = nums.split(",");
  let u = {
    name: "",
    nums: [],
  };
  u.name = name;
  username = name;
  for (let i = 0; i < arr.length; i++) {
    u["nums"].push({ value: arr[i], token: t });
    t++;
  }
  const user = await User(u);
  await user.save();
  res.render("show", { u });
});

app.get("/download", async (req, res) => {
  const filename = username + "_doc" + ".pdf";
  const userObj = await User.findOne({ name: username });

  ejs.renderFile(
    path.join(__dirname, "./views/download.ejs"),
    { u: userObj },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        let options = {
          height: "11.25in",
          width: "8.5in",
          header: {
            height: "20mm",
          },
          footer: {
            height: "20mm",
          },
        };

        pdf.create(data, options).toFile("report.pdf", function (err, data) {
          if (err) {
            console.log(err);
          } else {
            res.download("report.pdf");
            console.log("File created successfully");
          }
        });
      }
    }
  );
});

app.get("/admin", async (req, res) => {
  const filename = "admin" + "_doc" + ".pdf";
  const userObj = await User.find();

  console.log(userObj);

  ejs.renderFile(
    path.join(__dirname, "./views/admin.ejs"),
    { u: userObj },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        let options = {
          height: "11.25in",
          width: "8.5in",
          header: {
            height: "20mm",
          },
          footer: {
            height: "20mm",
          },
        };

        pdf.create(data, options).toFile("admin.pdf", function (err, data) {
          if (err) {
            console.log(err);
          } else {
            res.download("admin.pdf");
            console.log("File created successfully");
          }
        });
      }
    }
  );
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("App listening on port 3000");
});
