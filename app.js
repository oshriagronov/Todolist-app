// Import essential modules.
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import _ from "lodash"
import ejs from "ejs"

const app = express();
const port = 3000;

// Connecting to the Database for reading data and if the db doesn't exist mongoDB will create one automatically.
mongoose.connect("mongodb://127.0.0.1:27017/todolistData", {useNewUrlParser : true});

// List scheme
const listSscheme = mongoose.Schema({
  listName: {type: String, required: (true, "You have to give a name to the list")},
  tasks: [{
    _id: {type: Number, required: (true, "id is missing")},
    text: String
  }]
});
// Creating a model
const lists = mongoose.model("List", listSscheme);


//Global variable to save the name of custom lists that the user trying to get.
let listName = "Home"; // Home is the name as default list.

// Arrays that temporarily store the tasks of the list.
let tasksArray = [];

// Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));


/*
Dynamic route to access different lists.
-> if the list already exist, than it will show the tasks.
-> else it will create one with the name the user wrote and initial an empty tasks array.
*/
app.get("/:ListName", async(req, res) =>{
  listName = _.capitalize(req.params.ListName);
  try{
    const foundList = await lists.findOne({listName: listName});
    tasksArray = foundList.tasks;
  }

  catch(err){
    console.log("The list doesn't exist thus creating new one..");
    const newList = new lists({
      listName: listName,
      tasks: []
    });
    newList.save();
    tasksArray = [];
  }

  finally{

    res.render("list.ejs", {
      listName: listName,
      tasksArray:  tasksArray
    });
  }
});


// POST for adding new tasks
app.post("/submitNewTask", async(req, res) => {
  /*
  Before searching in the database we need to check if we have any
  tasks at all, if no than we just need to assign to the id a '0'/
  else we need to take the "biggest" id number as a starting point to he new task.
  */
  let lastId;
  if(tasksArray.length === 0){
    lastId = 0;
  }
  else{
    lastId =  tasksArray.map(({ _id }) => _id).toSorted((a,b) => b-a)[0];
  }
  /*
  Before we save the new task we have to do the next steps:
  1. We have to find the list within the collection.
  2. Then get the tasks array of from the list.
  3. Then use $push to add the new task as the scheme required.
  */
  try{
    await lists.findOneAndUpdate({listName: listName}, {$push: {tasks: {
      _id: lastId + 1,
      text: req.body["new-task"]
    }}});
    res.redirect("/" + listName);
  }
  catch(err){
    console.log(err + "\nSomething went wrong with saving the task to the database");
  }
});

// DELETE completed tasks from the lists
app.post("/checkedTask", async(req, res) => {
  /*
  Here we have the same process as adding new task but now we delete using pull
  instead of adding by using push
  */
 try{
    await lists.findOneAndUpdate({listName: listName}, {$pull: {tasks: {
      _id: req.body.checkbox
    }}});
    res.redirect("/" + listName);
  }
  catch(err){
    console.log(err);
  }

});

// listening function port 3000(port variable)
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
