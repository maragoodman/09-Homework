const fs = require("fs");
const inquirer = require("inquirer");
const generateMarkdown = require("./utils/generateMarkdown");
const open = require("open");
const util = require("util");
const axios = require("axios");

// Question object passed into inquirer.prompt
const questions = [
  {
    type: "input",
    name: "username",
    message: "What is your Github username?",
  },
  {
    type: "input",
    name: "title",
    message: "What do you want to name your project?",
    default: "01-Project",
  },
  {
    type: "input",
    name: "description",
    message: "Please enter a short description of your project",
    default:
      "This project will create a command-line application that dynamically generates a README.md from a user's input. The application will be invoked with the following command: node index.js",
  },
  {
    type: "input",
    name: "installation",
    message: "What command is required to install the package?",
    default: "npm install",
  },
  {
    type: "input",
    name: "usage",
    message: "How would you utilize the project?",
  },
  {
    type: "list",
    name: "license",
    message: "What licenses are required for this project?",
    choices: ["MIT", "The Unlicense", "zLib License", "ISC", "Apache", "BSD"],
  },
  {
    type: "list",
    name: "contributing",
    message: "Who are the project contributors?",
    choices: ["Myself", "Me and Other Team Members", "Primarily Others"],
  },
  {
    type: "input",
    name: "tests",
    message: "Which command is required to run tests?",
    default: "npm run test",
  },
  {
    type: "input",
    name: "email",
    message: "What is your email address for questions?",
    default: "sample@gmail.com",
  },
];

const writeFileASync = util.promisify(fs.writeFile);
const fileName = "readme.md";

// Program flow activated by init()
async function init() {
  try {
    // Call inquirer prompts and await answers
    const inquirerAnswers = await inquirer.prompt(questions);

    // Create queryURL for axios call to the github API
    const queryUrl = `https://api.github.com/users/${inquirerAnswers.username}`;

    // Get user picture URL from the github axios call
    try {
      const userPicture = await axios.get(queryUrl).then(function (res) {
        return res.data.avatar_url;
      });

      // Add this URL to the inquirerAnswers object
      inquirerAnswers.picture = userPicture;
    } catch (err) {
      throw "Username not found.  Please try again.";
    }

    // Pass answers from inquirer prompt into the generateMarkdown
    const readme = generateMarkdown(inquirerAnswers);

    // Write readme file with generateMarkdown
    await writeFileASync(fileName, readme);
    console.log("Wrote README!");
  } catch (err) {
    console.log(err);
  }
}

// Call function to start
init();
