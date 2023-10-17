// Import essential modules and setting them up
import express from "express";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Connecting to the Database for reading data
mongoose.connect("mongodb://127.0.0.1:27017/todolistData", {useNewUrlParser : true});

// Scheme for creating new tasks
const newTaskSchema = mongoose.Schema({
  _id: {type: Number, required: (true, "id is missing.")},
  text: String,
});
// customLists scheme
const customListsScheme = mongoose.Schema({
  listName: {type: String, required: (true, "You have to give a name to the list")},
  tasks: [newTaskSchema]
});
// Creating a model to create task in the required structure
const todayTasks = mongoose.model("todayTasks", newTaskSchema);
const workTasks = mongoose.model("workTasks", newTaskSchema);
const customLists = mongoose.model("customList", customListsScheme);

/*
Global variable to save the name of custom lists that the user trying to get.
I decided to go with global variable because passing the name embedded in the URL.
*/
let customListName;

// Arrays to store temporarily the data
let todayTasksArray = [];
let workTasksArray = []; 
let customListTasksArray = [];

// Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res, next) =>{
  todayTasksArray = await todayTasks.find({});
  next();
});

app.get("/work", async (req, res, next) =>{
  workTasksArray = await workTasks.find({});
  next();
});

// Main page render section

// Today list homepage render
app.get("/", (req,res) =>{
  res.render("todayList.ejs",{
    tasksDataBase: todayTasksArray
  });
});

// Work list homepage render
app.get("/work", (req,res) =>{
  res.render("work.ejs",{
    tasksDataBase: workTasksArray
  });
});

// Custom list main page render
app.get("/customList", (req, res) => {
  res.render("customList.ejs", {
    customListName: customListName,
    tasksDataBase: customListTasksArray
  });
});

/*
Dynamic route for custom lists
-> if the list already exist than it's just route to the main page
-> else it will create one with the name the user wrote and empty tasks array
*/
app.get("/List/:ListName", async(req, res) =>{
  customListName = req.params.ListName;
  const foundList = await customLists.findOne({listName: customListName});
  if(foundList != null){
    customListTasksArray = foundList.tasks;
    res.redirect("/customList");
  }
  else{
    const newCustomList = new customLists({
      listName: customListName,
      tasks: []
    });
    newCustomList.save();
    res.redirect("/List/" + customListName);
  }
});


// POST section for adding new tasks

// Adding new task for the today list
app.post("/todaySubmit", async(req, res) =>{
  let lastId;
  /*
  Checking if the array of tasks is empty:
  -> if true then we assign the zero to the id
  -> else it will take the biggest id and add 1 to to it.
  ** It's probably not efficient way but i will have a look on the subject to make it better
  */
  if(todayTasksArray.length === 0){
    lastId = 0;
  }
  else{
    lastId =  todayTasksArray.map(({ _id }) => _id).toSorted((a,b) => b-a)[0]; // taking the array and map the id's, then sorting the array from the biggest number to the smallest
  }
  const newTodayTask = new todayTasks({
    _id: lastId + 1,
    text: req.body["new-item"]
  });
  newTodayTask.save();
  res.redirect("/");
});

// Adding new task for the work list
app.post("/workSubmit", async(req, res) =>{
  let lastId;
  if(workTasksArray.length === 0){
    lastId = 0;
  }
  else{
    lastId =  workTasksArray.map(({ _id }) => _id).toSorted((a,b) => b-a)[0];
  }
  const  newWorkTask = new workTasks({
    _id: lastId + 1,
    text: req.body["new-item"]
  });
  newWorkTask.save();
  res.redirect("/work");
});

// Adding new task for the custom list
app.post("/submitCustomList", async(req, res) => {
  let lastId;
  if(customListTasksArray.length === 0){
    lastId = 0;
  }
  else{
    lastId =  customListTasksArray.map(({ _id }) => _id).toSorted((a,b) => b-a)[0];
  }
  /*
  In contrast to the above POST functions, here we have to do additional step:
  -> We have to find the list within the collection
  -> Then get the tasks array of objects
  -> Then use $push to add the new task using the "newTaskScheme"
  */
  await customLists.findOneAndUpdate({listName: customListName}, {$push: {tasks: {
    _id: lastId + 1,
    text: req.body["new-item"]
  }}});
  res.redirect("/List/" + customListName);
});

// DELETE section for deleting completed tasks from the lists

// Delete checked tasks today list
app.post("/checkedTodayList", async(req, res) =>{
  await todayTasks.deleteOne({_id: req.body.checkbox}); // req.body.checkbox gives the id number
  res.redirect("/");
});
// Delete checked tasks from work list
app.post("/checkedWorkList", async(req, res) =>{
  await workTasks.deleteOne({_id: req.body.checkbox}); // req.body.checkbox gives the id number
  res.redirect("/work");
});
// Delete checked tasks from custom list
app.post("/checkCustomList", async(req, res) => {
    /*
  In contrast to the above DELETE functions, here we have to do additional step:
  -> We have to find the list within the collection
  -> Then get the tasks array of objects
  -> Then use $pull to delete the exist task by _id
  */
  await customLists.findOneAndUpdate({listName: customListName}, {$pull: {tasks: {
    _id: req.body.checkbox
  }}});
  res.redirect("/List/" + customListName);
});

// listening function port 3000(port variable)
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
