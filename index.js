// createElement
// appendChild
// removeChild
// innerHtml
// innerText
// querySelector
// setAttribute
// classList.add/remove

// DATA
const data = [
  {
    id: 1,
    title: "Do something",
    isDone: false,
  },
  {
    id: 2,
    title: "Do something else",
    isDone: false,
  },
  {
    id: 3,
    title: "Done?",
    isDone: true,
  },
];

// SELECTED ROOT ELEMENTS
const taskListUL = document.querySelector("#task-list");
const submitBtn = document.querySelector("button");
const newTaskTextInput = document.querySelector("#new-task-text");

// FUNCTIONS TO UPDATE DATA + RE-RENDER
function toggleTaskIsDone(task) {
  console.log("toggling task isDone for task", task);
  // update the state
  task.isDone = !task.isDone;
  // because state was changed, we need to re-render the application
  renderTasks();
}

function createTask(title) {
  if (title.length === 0) return;
  console.log("new task title", title);
  // create a new task
  const newTask = {
    id: data.length + 1,
    title: title,
    isDone: false,
  };
  // add task to list
  data.push(newTask);
  // rerender task list
  renderTasks();
}

// FUNCTIONS TO HANDLE USER EVENTS (clicks, etc...)
function handleClick(event, task) {
  console.log("checkbox was clicked:", event);
  console.log("   the task of this checkbox is", task);
  toggleTaskIsDone(task);
}

// METHODS FOR BUILDING THE INTERFACE
function registerSubmitNewTask() {
  submitBtn.addEventListener("click", () => {
    // select the text that was typed in input
    const newTaskTitle = newTaskTextInput.value;
    // try to create a new task
    createTask(newTaskTitle);
    // clear the text input
    newTaskTextInput.value = "";
  });
}

function createTaskCheckbox(task) {
  // create an input of type checkbox
  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  // set checked = true if task is complete
  checkbox.checked = task.isDone;
  // add an event listener on the checkbox
  // checkbox.addEventListener("click", (event) => {
  //   console.log("checkbox was clicked:", event);
  //   console.log("the task of this checkbox is", task);
  // });
  checkbox.addEventListener("click", (event) => handleClick(event, task));
  // return the created checkbox
  return checkbox;
}

function renderTasks() {
  console.log("calling renderTasks()");
  // reset my task list completely
  taskListUL.innerHTML = "";

  // for each task in my data, create a new li element
  for (let i = 0; i < data.length; i++) {
    const task = data[i];
    // create the <li></li>
    const taskLi = document.createElement("li");
    // set some attributes (maybe)
    taskLi.setAttribute("id", task.id);
    // set the inner text
    taskLi.innerText = task.title;
    // create the checkbox
    const taskCheckbox = createTaskCheckbox(task, taskLi);
    // compose the taskLi with any child elements
    taskLi.appendChild(taskCheckbox);
    // add the list element inside the taskListUL
    taskListUL.appendChild(taskLi);
  }
}

// INITIAL RENDER
function main() {
  console.log("running main()");
  console.log("data: ", data);
  registerSubmitNewTask();
  renderTasks();
}

main();
