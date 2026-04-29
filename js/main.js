var taskInput = document.querySelector(".task-input input");
var btnAdd = document.querySelector(".task-input .btn-add");
var taskList = document.querySelector(".task-list");
var taskCount = document.querySelector(".task-total span");
var taskCompleted = document.querySelector(".task-done span");
var btnClearAll = document.querySelector(".task-controls .btn-clear");
var btnFinishAll = document.querySelector(".task-controls .btn-complete");

let tasks = [];

window.onload = () => taskInput.focus();

function showEmptyMessage() {
    if (!document.querySelector(".empty-message")) {
        const msg = document.createElement("span");
        msg.textContent = "No Tasks To Show";
        msg.className = "empty-message";
        taskList.appendChild(msg);
    }
}

function updateStats() {
    taskCount.textContent = document.querySelectorAll(".task-item").length;
    taskCompleted.textContent = document.querySelectorAll(".task-item.done").length;
}

function renderTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = `<span class="empty-message">No Tasks To Show</span>`;
    } else {
        taskList.innerHTML = tasks
            .map((task, i) => `
                <span class="task-item ${task.done ? "done" : ""}">
                    ${task.text}
                    <span class="btn-remove" data-id="${i}">Delete</span>
                </span>
            `)
            .join("");
    }
    updateStats();
}

function addTask(text) {
    tasks.push({ text, done: false });
    localStorage.setItem("OurTasks", JSON.stringify(tasks));
    renderTasks();
    Swal.fire("You Added New Task!", "", "success");
}

function removeTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("OurTasks", JSON.stringify(tasks));
    renderTasks();
    Swal.fire("You Deleted This Task", "", "success");
}

btnClearAll.addEventListener("click", () => {
    if (tasks.length === 0) return;

    tasks = [];
    localStorage.setItem("OurTasks", "[]");
    renderTasks();
    Swal.fire("You Deleted All Tasks!", "", "success");
});

btnFinishAll.addEventListener("click", () => {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].done = true;
    }
    localStorage.setItem("OurTasks", JSON.stringify(tasks));
    renderTasks();
    Swal.fire("You Finished All Tasks!", "", "success");
});

btnAdd.addEventListener("click", () => {
    const text = taskInput.value.trim();

    if (!text) {
        Swal.fire("No Value To Add", "Please Add Text To The Input...", "error");
        return;
    }

    if (tasks.some(t => t.text === text)) {
        Swal.fire("Task Already Exist!", "Please, Enter Another Task.", "error");
        taskInput.value = "";
        return;
    }

    addTask(text);
    taskInput.value = "";
    taskInput.focus();
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-remove")) {
        removeTask(+e.target.dataset.id);
    }

    if (e.target.classList.contains("task-item")) {
        let items = document.querySelectorAll(".task-item");
        let index = -1;

      
        for (let i = 0; i < items.length; i++) {
            if (items[i] === e.target) {
                index = i;
                break;
            }
        }

        if (index !== -1) {
            tasks[index].done = !tasks[index].done;
            localStorage.setItem("OurTasks", JSON.stringify(tasks));
            renderTasks();

            Swal.fire(
                tasks[index].done ? "You Finished This Task" : "You Unfinished This Task",
                "",
                "success"
            );
        }
    }
});

if (localStorage.getItem("OurTasks")) {
    tasks = JSON.parse(localStorage.getItem("OurTasks"));
    renderTasks();
} else {
    showEmptyMessage();
}
