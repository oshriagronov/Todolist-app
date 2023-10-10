import express from "express";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { type } from "os";

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));
// maybe it will be better to add middleware for all data base related setup
//mongoose.connect("<Database url(mongosh)>", {useNewUrlParser : true})
const newTaskSchema = mongoose.Schema({
  _id: {type: Number, required: (true, "id is missing.")},
  task: String,
});

let todayTasksArray = []; // NEED to read tasks of today list from the data base  and saving them as array(?)
let workTasksArray = []; // NEED to read of work list from the data base  and saving them as array(?)

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))
// Today list homepage + refresh from redirect "/todaySubmit"
app.get("/", (req, res) => {
  res.render("todayList.ejs", {
    length: todayTasksArray.length,
    tasksDataBase: todayTasksArray
  });
});
// Work list homepage + refresh from redirect "/workSubmit"
app.get("/work", (req,res) =>{
  res.render("work.ejs",{
    length: workTasksArray.length,
    tasksDataBase: workTasksArray
  });
});
// POST function for adding new task for the today list
app.post("/todaySubmit", (req, res) =>{
  todayTaskBank.push(req.body["new-item"]); // NEED to add the inputs to data base
  res.redirect("/");
});
// POST function for adding new task for the work list
app.post("/workSubmit", (req, res) =>{
  workTaskBank.push(req.body["new-item"]); // NEED to add the inputs to data base
  res.redirect("/work");
});
// listening function port 3000(port)
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

