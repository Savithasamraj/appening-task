const express = require("express");
const app = express();
const bcryptjs = require("bcryptjs");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
require("dotenv").config();
const jwt = require("jsonwebtoken");
app.use(express.json());
// signup
app.post("/register", async function (req, res) {

    try {
      const connection = await mongoClient.connect(URL);
  
      const db = await connection.db("project");
  
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(req.body.password, salt);
      req.body.password = hash;
      await db.collection("users").insertOne(req.body);
  
      await connection.close();
  
      res.json({
        message: "Successfully Registered",
      });
    } catch (error) {
      res.json({
        message: error,
      });
    }
  });

// login=> token is generated
app.post("/login", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("project");
  
      const user = await db
        .collection("users")
        .findOne({ username: req.body.username });
  
      console.log(user);
  
      if (user) {
        const match = await bcryptjs.compare(req.body.password, user.password);
        if (match) {
          // Token is generated
          const token = jwt.sign({ _id: user._id }, process.env.SECRET);
  
          res.json({
            message: "Welcome To PEOPLE'S LAB",
            token,
          });
        } else {
          res.json({
            message: "Password is incorrect",
          });
        }
      } else {
        res.json({
          message: "User not found",
        });
      }
    } catch (error) {
      console.log("error");
    }
  });
  /// verifying the token
  let authenticate = function (req, res, next) {
    if (req.headers.authorization) {
      try {
        let verify = jwt.verify(req.headers.authorization, process.env.SECRET);
  
        if (verify) {
          req.userid = verify._id;
          next();
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.json("errors");
      res.status(401).json({ message: "Unauthorized" });
    }
  };
  
  //2.user list tht can be viewed by amin only:
  let authenticateadmin = function (req, res, next) {
    if (req.headers.authorization) {
      try {
        let verify = jwt.verify(req.headers.authorization, process.env.SECRET);
  
        if (verify) {
          req.userid = verify._id;
          next();
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.json("errors");
      res.status(401).json({ message: "Unauthorized" });
    }
  };
