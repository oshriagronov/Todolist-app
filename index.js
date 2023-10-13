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

// Connecting to the Database for reading data
mongoose.connect("mongodb://127.0.0.1:27017/todolistData", {useNewUrlParser : true});
// Creating a scheme for tasks
const newTaskSchema = mongoose.Schema({
  _id: {type: Number, required: (true, "id is missing.")},
  text: String,
});
// Creating a model to create task in the required structure
const todayTasks = mongoose.model("todayTasks", newTaskSchema);
const workTasks = mongoose.model("workTasks", newTaskSchema);

// Arrays to store temporarily the data
let todayTasksArray = [];
let workTasksArray = []; 

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
    tasksDataBase: todayTasksArray
  });
});

// Work list homepage + refresh from redirect "/workSubmit"
app.get("/work", (req,res) =>{
  res.render("work.ejs",{
    tasksDataBase: workTasksArray
  });
});

// POST function for adding new task for the today list
app.post("/todaySubmit", async(req, res) =>{
  const idArray =  todayTasksArray.map(({ _id }) => _id);
  const lastId = idArray.sort((a,b) => b-a)[0];
  const  newTodayTask = new todayTasks({
    _id: lastId + 1,
    text: req.body["new-item"]
  });
  newTodayTask.save();
  res.redirect("/");
});

// POST function for adding new task for the work list
app.post("/workSubmit", async(req, res) =>{
  const idArray =  workTasksArray.map(({ _id }) => _id);
  const lastId = idArray.sort((a,b) => b-a)[0];
  const  newWorkTask = new workTasks({
    _id: lastId + 1,
    text: req.body["new-item"]
  });
  newWorkTask.save();
  res.redirect("/work");
});

// DELETE method to delete checked tasks today list
app.post("/checkedTodayList", async(req, res) =>{
  await todayTasks.deleteOne({_id: req.body.checkbox}); // req.body.checkbox gives the id number
  res.redirect("/")
});
// DELETE method to delete checked tasks from work list
app.post("/checkedWorkList", async(req, res) =>{
  await workTasks.deleteOne({_id: req.body.checkbox}); // req.body.checkbox gives the id number
  res.redirect("/work")
});

// listening function port 3000(port)
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
