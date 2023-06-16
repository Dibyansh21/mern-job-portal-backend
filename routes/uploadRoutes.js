const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { promisify } = require("util");
const formidable = require("formidable");

const pipeline = promisify(require("stream").pipeline);

const router = express.Router();

router.post("/resume", (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: "Error while uploading",
      });
      return;
    }

    const file = files.file;

    if (file.type !== "application/pdf") {
      res.status(400).json({
        message: "Invalid format",
      });
      return;
    }

    const filename = `${uuidv4()}.pdf`;

    pipeline(
      fs.createReadStream(file.path),
      fs.createWriteStream(`${__dirname}/../public/resume/${filename}`)
    )
      .then(() => {
        res.send({
          message: "File uploaded successfully",
          url: `/host/resume/${filename}`,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  });
});

router.post("/profile", (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: "Error while uploading",
      });
      return;
    }

    const file = files.file;

    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png"
    ) {
      res.status(400).json({
        message: "Invalid format",
      });
      return;
    }

    const filename = `${uuidv4()}${file.type === 'image/jpeg' ? '.jpg' : '.png'}`;

    pipeline(
      fs.createReadStream(file.path),
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
      .then(() => {
        res.send({
          message: "Profile image uploaded successfully",
          url: `/host/profile/${filename}`,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  });
});

module.exports = router;
