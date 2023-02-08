import inquirer from "inquirer";
import fs from "fs";
import queryDB from "./queryDB.js";
import dbFileCheck from "./dbFileCheck.js";

export default async function updateData(info) {
  dbFileCheck();

  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "recordID",
        message: "Enter Record ID",
      },
    ]);

    let current;

    info.forEach((element) => {
      if (element.id === answers.recordID) {
        current = element;

        updateDetails(current, info);
      }
    });
  } catch (error) {
    console.log("Something went wrong!", error);
  }
}

async function updateDetails(current, info) {
  try {
    const feedbacks = await inquirer.prompt([
      {
        type: "input",
        default: current.Name,
        name: "name",
        message: "What's your name?",
      },
      {
        type: "number",
        default: current.Phone,
        name: "phone",
        message: "What's your phone?",
      },
      {
        type: "list",
        default: current.Age,
        name: "age",
        message: "Are an adult?",
        choices: [
          { name: "Y", value: "Adult" },
          { name: "N", value: "Minor" },
        ],
      },
    ]);

    current.Name = feedbacks.name;
    current.Phone = feedbacks.phone;
    current.Age = feedbacks.age;

    await fs.writeFile("db.json", JSON.stringify(info), function (err) {
      if (err) {
        console.log(err);
      }
      console.log("updated");
    });
  } catch (error) {
    console.log("Something went wrong!", error);
  }
}

queryDB(updateData);