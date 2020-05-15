const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const imageUpload = require("../services/imageUpload");
const express = require("express");
const path = require("path");
const { createHistograms } = require("../utils/createHistogram");

const { spawn } = require("child_process");
var fs = require("fs");

//pass in require login middleware
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  app.post("/api/stripe", requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 500,
      currency: "usd",
      description: "credit purchase",
      source: req.body.id
    });
    req.user.credits += 5;
    const user = await req.user.save();
    res.send(user);
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });

  app.post("/api/histogram", async (req, res) => {
    const histograms = createHistograms(
      "http://localhost:5000/services/uploads/test.png"
    );
    console.log(histograms);
    // console.log(req.data)
    // res.send(histograms)
  });

  app.post("/api/image-upload", imageUpload.single("file"), async function (
    req,
    res,
    next
  ) {
    req.user.images.push(
      "http://localhost:5000/services/uploads/" + req.file.filename
    );
    const user = await req.user.save();
    res.send(user.images);

    //big dick energy
    if (!req.file) {
      res.status(500);
      return next(err);
    }
  });

  app.post("/api/build-mosaic", async (req, res) => {
    var dataToSend;

    const python = spawn("python", [
      "/Users/skipdisk/Desktop/csci/MosoBros/routes/image.py",
      "/Users/skipdisk/Desktop/csci/MosoBros/services/uploads/" +
        req.body.mainImage.slice(39),
      "/Users/skipdisk/Desktop/csci/MosoBros/services/uploads",
      "mosaic-" + Date.now() + ".jpeg"
    ]);
    // collect data from script
    python.stdout.on("data", function (data) {
      console.log("Pipe data from python script ...");
      dataToSend = data.toString();
    });

    // in close event we are sure that stream from child process is closed
    python.on("close", async (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      req.user.mosaicImages.push(dataToSend);
      const user = await req.user.save();
      res.send(user.mosaicImages);
    });
  });

  //links upload folder for api to be able to access it in localhost:5000/api/services/uploads/:imageName
  app.get("/", express.static(path.join(__dirname, "/api/services/uploads")));

  app.get("/", express.static(path.join(__dirname, "/api/services/mosaic")));
};
