import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { User } from "./src/models/User";
import { STARTMONGO } from "./src/config/config";
import Joi from "joi";
import bcrypt from "bcryptjs";
import boom from "express-boom";

import {
  UserValidation,
  getUserValidation
} from "./src/validation/UserValidation";

STARTMONGO();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(boom());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Change URL to use!");
});

app.get("/noresults", (req, res) => {
  res.send("User not found");
});
app.get("/find/:username", (req, res) => {
  //value must be a object.
  const { error } = Joi.validate(
    { username: req.params.username },
    getUserValidation
  );
  if (error) {
    res.status(422).send(error.message);
  }
  User.find({ username: req.params.username }).then(success => {
    if (success.length > 0) {
      res.send(success);
    } else {
      // res.send("No results found!"); ADDED REDIRECT.
      res.redirect("/noresults");
    }
  });
});

app.post("/service/user/signup", (req, res, next) => {
  const { username, password } = req.body;

  const { error } = Joi.validate(req.body, UserValidation);

  if (error) {
    res.status(422).write(JSON.stringify(error.details[0].message)); // Responds Boom message + reasons object
  }

  //Hashes password
  const hashedPassword = bcrypt.hashSync(password, 8);

  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        res.status(400).send(" User already exists");
      } else {
        res.status(200).send("Created");

        User.create({
          username: username,
          password: hashedPassword
        });
      }
    })
    .catch(error => res.sendStatus(404).send(error));
});

app.post("/service/user/sigin", (req, res) => {
  const { username, password } = req.body;

  const { error } = Joi.validate(req.body, UserValidation, {
    abortEarly: false
  });

  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }

  User.findOne({ username: req.body.username }).then(user => {
    if (user.password !== req.body.password) {
      res.send("Passwords dont match");
    } else {
      res.send("You have logged in");
    }
  });
});
app.listen(9898, "localhost", () => {
  console.log("Connected");
});
