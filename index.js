/*
-> Check how to make the access to the database more efficient by opening and closing the connection.
-> Delete unnecessary lines of code(library, middleware etc).
*/
import express from "express";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { type } from "os";

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

mongoose.connect("mongodb://127.0.0.1:27017/todolistData", {useNewUrlParser : true});
// Creating a scheme for tasks
const newTaskSchema = mongoose.Schema({
  _id: {type: Number, required: (true, "id is missing.")},
  text: String,
});
// Creating a sub collections in todolistData
const todayTasks = mongoose.model("todayTasks", newTaskSchema);
const workTasks = mongoose.model("workTasks", newTaskSchema);


let todayTasksArray = []; // NEED to read tasks of today list from the data base  and saving them as array(?)
let workTasksArray = []; // NEED to read of work list from the data base  and saving them as array(?)

// Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", async (req, res, next) =>{
  todayTasksArray = await todayTasks.find({});
  next();
});

app.get("/work", async (req, res, next) =>{
  workTasksArray = await workTasks.find({});
  next();
});

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
  const  newTodayTask = new todayTasks({
    _id: todayTasksArray.length + 1,
    text: req.body["new-item"]
  });
  newTodayTask.save();
  res.redirect("/");
});

// POST function for adding new task for the work list
app.post("/workSubmit", (req, res) =>{
  const  newWorkTask = new workTasks({
    _id: workTasksArray.length + 1,
    text: req.body["new-item"]
  });
  newWorkTask.save();
  res.redirect("/work");
});

// listening function port 3000(port)
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

