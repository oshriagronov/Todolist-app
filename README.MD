# Todo-list Website
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
<br>
The project is basically a todo-list on the web where you can add tasks and clear tasks you finished!

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Features](#features)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Acknowledgements](#acknowledgements)

## General info
The project is as the name suggests, it's a simple todo-list website with a couple of features.
I created this project as part of my course in Udemy and it was a good learning experience and fun!
I hope you will enjoy it too and I will be glad to get tips :)

## Technologies
- Software language: JS, HTML, CSS
- Frameworks: Node.js
- NPM modules dependencies: express, mongoose, bodyParser
- Database: MongoDB (NoSQL)

## Features
- User can create lists of their own with just typing the name in the url bar
- All the data of these lists are saved locally using MongoDB as a database, so refreshing the page won't erase changes.

## Screenshots
![Today-list-image](./public/assets/Today-list-image.jpg)

![Work-list-image](./public/assets/Work-list-image.jpg)

## Setup
To run the todo-list website you need couple of softwares:
- node.js
- npm modules I included(easy to install)
- MongoDB
> All those tools you can install pretty easily with a quick search on youtube for a guide

### How to start?
1. First download all project files
2. Open terminal in the project and install all the modules

```bash
npm i
```

3. Run the project with node(or nodemon)

```bash
node app.js
```
4. Open the browser and enter in the url bar:
```
localhost:3000/<name of the list>
```

- With this structure you access you lists that already exist and if the list doesn't exist it will create one automatically.
- If you don't enter a name it will use the default list called "Home"

## Acknowledgements
I would like to thank to Dr. Angela Yu for creating the great course "The Complete 2023 Web Development Bootcamp"
> Link to the course [here](https://www.udemy.com/course/the-complete-web-development-bootcamp/?kw=The+Complete+2023+Web+Development+Bootcamp&src=sac)
