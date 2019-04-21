import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { User } from "./src/models/User";
import { STARTMONGO } from "./src/config/config";
import Joi from "joi";
import { UserValidation } from "./src/validation/UserValidation";

STARTMONGO();
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Change URL to use!");
});

app.get("/find/:username", (req, res) => {
  User.find({ username: req.params.username }).then(success => {
    if (success.length > 0) {
      res.send(success);
      // res.redirect('/')
    } else {
      res.send("No results found!");
    }
  });
});

app.post("/service/user", (req, res) => {
  const {username, password} = req.body;

  const {error} = Joi.validate(req.body, UserValidation);

  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }

  User.findOne({username: req.body.username}).then(user => {
    if (user) {
      res.status(400).send(" User already exists");
    } else {

      User.create({
        username: username,
        password: password
      })
    }
  })
      .then(() => res.send('User Created'))
      .catch(() => res.sendStatus(404).send(error));
});

  app.listen(9898, "localhost", () => {
    console.log("Connected");
  });

