// DATA
// const data = [
//   {
//     id: 1,
//     title: "Do something",
//     isDone: false,
//   },
//   {
//     id: 2,
//     title: "Do something else",
//     isDone: false,
//   },
//   {
//     id: 3,
//     title: "Done?",
//     isDone: true,
//   },
// ];

// json-server --watch db.json --port 4000

const state = {
  tasks: [],
  titleFilter: "",
  statusFilter: "all",
};

// SELECTED ROOT ELEMENTS
const taskListUL = document.querySelector("#task-list");
const submitBtn = document.querySelector("button");
const newTaskTextInput = document.querySelector("#new-task-text");

// filters
const titleFilterInput = document.querySelector("#title-filter");

// FUNCTIONS TO UPDATE DATA + RE-RENDER
function toggleTaskIsDone(task) {
  console.log("toggling task isDone for task", task);
  // // update the state
  // task.isDone = !task.isDone;
  // // because state was changed, we need to re-render the application
  // renderTasks();

  const bodyPayload = {
    ...task, // clone task, then overwrite isDone
    isDone: !task.isDone,
  };

  const postRequestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    // take the JS object bodyPayload
    // convert it into a JSON string
    body: JSON.stringify(bodyPayload),
  };

  const URL = `http://localhost:4000/tasks/${task.id}`;

  fetch(URL, postRequestOptions)
    .then((response) => {
      return response.json();
    })
    .then((updatedTask) => {
      console.log("PUT /tasks json data:", updatedTask);

      // // 1. update local state by appending jsonData onto the tasks array
      // state.tasks.push(newTask);

      state.tasks = state.tasks.map((task) => {
        if (task.id === updatedTask.id) return updatedTask;
        return task;
      });

      // // 2. re-render the UI
      renderTasks();
    });
}

function deleteTask(taskId) {
  console.log("deleting task", taskId);

  const requestOptions = {
    method: "DELETE",
  };

  const URL = `http://localhost:4000/tasks/${taskId}`;

  fetch(URL, requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((deletedTask) => {
      console.log("DELETE /tasks json data:", deletedTask);

      // // 1. update local state by appending jsonData onto the tasks array
      // state.tasks.push(newTask);

      state.tasks = state.tasks.filter((task) => task.id !== deletedTask.id);

      // // 2. re-render the UI
      renderTasks();
    });
}

// function createTask(title) {
//   if (title.length === 0) return;
//   console.log("new task title", title);
//   // create a new task
//   const newTask = {
//     id: state.tasks.length + 1,
//     title: title,
//     isDone: false,
//   };
//   // add task to list
//   state.tasks.push(newTask);
//   // rerender task list
//   renderTasks();
// }

// FUNCTIONS FOR API CALLS
function getTasksFromApi() {
  console.log("fetch GET /tasks");
  fetch("http://localhost:4000/tasks", {})
    .then((response) => {
      return response.json();
    })
    .then((jsonData) => {
      console.log("GET /tasks json data:", jsonData);

      // 1: update my local `state` with the jsonData
      state.tasks = jsonData;
      // 2: state was changed -> call relevant re-render functions
      renderTasks();
    });
}

function createTaskViaAPI(taskTitle) {
  if (taskTitle.length === 0) return;
  console.log("fetch POST /tasks");

  const bodyPayload = {
    title: taskTitle,
    isDone: false,
  };

  const postRequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // take the JS object bodyPayload
    // convert it into a JSON string
    body: JSON.stringify(bodyPayload),
  };

  fetch("http://localhost:4000/tasks", postRequestOptions)
    .then((response) => {
      return response.json();
    })
    .then((newTask) => {
      console.log("POST /tasks json data:", newTask);

      // 1. update local state by appending jsonData onto the tasks array
      state.tasks.push(newTask);
      // 2. re-render the UI
      renderTasks();
    });
}

// FUNCTIONS TO HANDLE USER EVENTS (clicks, etc...)
function handleClick(event, task) {
  console.log("checkbox was clicked:", event);
  console.log("   the task of this checkbox is", task);
  toggleTaskIsDone(task);
}

function handleTitleFilterChanged(event) {
  // update our state of our filter
  // state.titleFilter = event.target.value
  state.titleFilter = titleFilterInput.value;

  console.log("updated title filter", state.titleFilter);

  // state was updated, re-render
  renderTasks();
}

// METHODS FOR BUILDING THE INTERFACE
function registerSubmitNewTask() {
  submitBtn.addEventListener("click", () => {
    // select the text that was typed in input
    const newTaskTitle = newTaskTextInput.value;
    // try to create a new task
    createTaskViaAPI(newTaskTitle);
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

  // creating a new array that has a subset of tasks
  let filteredTasks = state.tasks.filter((task) =>
    task.title.includes(state.titleFilter)
  );

  filteredTasks = filteredTasks.filter((task) => {
    if (state.statusFilter === "all") return true;
    if (state.statusFilter === "done") return task.isDone;
    return task.isDone === false;
  });

  // for each task in my data, create a new li element
  for (let i = 0; i < filteredTasks.length; i++) {
    const task = filteredTasks[i];

    // if (state.titleFilter.length > 0) {
    //   if (task.title.includes(state.titleFilter) === false) {
    //     continue;
    //   }
    // }

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

    const button = document.createElement("button");
    button.innerText = "Delete";
    button.addEventListener("click", () => deleteTask(task.id));

    taskLi.appendChild(button);

    // add the list element inside the taskListUL
    taskListUL.appendChild(taskLi);
  }
}

function updateFilterUI() {
  titleFilterInput.value = state.titleFilter;
}

// INITIAL RENDER
function main() {
  console.log("running main()");
  console.log("data: ", state.tasks);

  // update filter UI
  updateFilterUI();

  // register handlers for filtering
  titleFilterInput.addEventListener("input", handleTitleFilterChanged);

  registerSubmitNewTask();
  // renderTasks();
  getTasksFromApi();
}

main();

// console.log("calling fetch...");
// fetch("http://localhost:4000/tasks", {})
//   .then((response) => {
//     console.log("received response");
//     return response.json();
//   })
//   .then((jsonData) => {
//     console.log("json data:", jsonData);
//     // rendering....
//   });
// console.log("ended index.js script");
