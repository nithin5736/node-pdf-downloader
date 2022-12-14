const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const pdf = require("html-pdf");
const ejs = require("ejs");
const path = require("path");
const User = require("./models/user");
const Member = require("./models/member");

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
  res.render("login");
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (user === null) {
    res.send("User does not exists");
  } else {
    if (
      user.password === req.body.password &&
      user.email === "admin@gmail.com"
    ) {
      res.redirect("/adminPage");
    } else if (user.password === req.body.password) {
      res.render("index");
    } else {
      res.send("Incorrect password");
    }
  }
});

let membername;

app.post("/add", async (req, res) => {
  const { member, nums } = req.body;
  console.log(req.body);
  let t = 10001;
  const arr = nums.split(",");
  let m = {
    member: "",
    nums: [],
  };
  m.member = member;
  membername = member;
  for (let i = 0; i < arr.length; i++) {
    m["nums"].push({ value: arr[i], token: t });
    t++;
  }
  const mem = await Member(m);
  await mem.save();
  res.render("show", { u: m });
});

app.get("/download", async (req, res) => {
  const memberObj = await Member.findOne({ member: membername });

  ejs.renderFile(
    path.join(__dirname, "./views/download.ejs"),
    { u: memberObj },
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

app.get("/adminPage", async (req, res) => {
  const userObj = await Member.find();
  res.render("adminPage", { u: userObj });
});

app.post("/filter", async (req, res) => {
  console.log(req.body);
  const members = await Member.find();
  const filteredMembers = [];
  for (let i = 0; i < members.length; i++) {
    if (
      members[i].time.toISOString().slice(0, 10) >= req.body.startdate &&
      members[i].time.toISOString().slice(0, 10) <= req.body.enddate
    ) {
      filteredMembers.push(members[i]);
    }
  }
  res.render("adminPage", { u: filteredMembers });
});

app.get("/admin", async (req, res) => {
  const userObj = await Member.find();
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
