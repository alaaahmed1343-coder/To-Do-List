var taskInput = document.querySelector(".task-input input");
var btnAdd = document.querySelector(".btn-add");
var taskList = document.querySelector(".task-list");
var taskCount = document.querySelector(".task-total span");
var taskCompleted = document.querySelector(".task-done span");
var btnClearAll = document.querySelector(".btn-clear");
var btnFinishAll = document.querySelector(".btn-complete");

let tasks = [];

window.onload = () => taskInput.focus();

function saveTasks() {
    localStorage.setItem("OurTasks", JSON.stringify(tasks));
}

function updateStats() {
    taskCount.textContent = tasks.length;
    taskCompleted.textContent = tasks.filter(t => t.done).length;
}

function renderTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = `<span class="empty-message">No Tasks To Show</span>`;
    } else {
        taskList.innerHTML = tasks.map((task, i) => `
            <span class="task-item ${task.done ? "done" : ""}" data-id="${i}">
                ${task.text}
                <span class="btn-remove" data-id="${i}">Delete</span>
            </span>
        `).join("");
    }

    updateStats();
}

function addTask(text) {
    tasks.push({ text, done: false });
    saveTasks();
    renderTasks();
    Swal.fire("Added!", "Task added successfully", "success");
}

function removeTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    Swal.fire("Deleted!", "Task removed", "success");
}

/* Add task */
btnAdd.addEventListener("click", () => {
    let text = taskInput.value.trim();

    if (!text) {
        Swal.fire("Error", "Please enter a task", "error");
        return;
    }

    if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        Swal.fire("Exists", "Task already exists", "error");
        return;
    }

    addTask(text);
    taskInput.value = "";
    taskInput.focus();
});

/* Enter key */
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") btnAdd.click();
});

/* Click events */
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("btn-remove")) {
        removeTask(+e.target.dataset.id);
    }

    if (e.target.classList.contains("task-item")) {
        let id = +e.target.dataset.id;
        tasks[id].done = !tasks[id].done;
        saveTasks();
        renderTasks();
    }
});

/* clear all */
btnClearAll.addEventListener("click", () => {
    tasks = [];
    saveTasks();
    renderTasks();
    Swal.fire("Cleared", "All tasks deleted", "success");
});

/* finish all */
btnFinishAll.addEventListener("click", () => {
    tasks.forEach(t => t.done = true);
    saveTasks();
    renderTasks();
    Swal.fire("Done", "All tasks completed", "success");
});

/* load from localStorage */
if (localStorage.getItem("OurTasks")) {
    tasks = JSON.parse(localStorage.getItem("OurTasks"));
    renderTasks();
}