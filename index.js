import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

let todayTaskBank = [];
let workTaskBank = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.render("index.ejs", {
    length: todayTaskBank.length,
    userInput: todayTaskBank
  });
});

app.get("/work", (req,res) =>{
  res.render("work.ejs",{
    length: workTaskBank.length,
    userInput: workTaskBank
  });
});

app.post("/", (req, res) =>{
  todayTaskBank.push(req.body["new-item"]);
  res.render("index.ejs", {
    length: todayTaskBank.length,
    userInput: todayTaskBank
  });

});

app.post("/work", (req, res) =>{
  workTaskBank.push(req.body["new-item"]);
  res.render("work.ejs", {
    length: workTaskBank.length,
    userInput: workTaskBank
  });

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


