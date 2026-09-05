
const taskInput = document.querySelector("#taskInput");
const btnAdd = document.querySelector("#btnAdd");
const taskList = document.querySelector("#taskList");

const totalTasks = document.querySelector("#totalTasks");
const completedTasks = document.querySelector("#completedTasks");
const progressPercent = document.querySelector("#progressPercent");

const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");

const btnFinishAll = document.querySelector("#btnFinishAll");
const btnClearCompleted = document.querySelector("#btnClearCompleted");
const btnDeleteAll = document.querySelector("#btnDeleteAll");

const filterButtons = document.querySelectorAll(".filter-btn");


let tasks = [];

let currentFilter = "all";


// =========================
// Load Tasks
// =========================

const savedTasks = localStorage.getItem("OurTasks");

if (savedTasks) {
    try {
        tasks = JSON.parse(savedTasks);
    } catch (error) {
        tasks = [];
    }
}


// Focus input when page loads

window.addEventListener("load", () => {
    taskInput.focus();
    renderTasks();
});


// =========================
// Save Tasks
// =========================

function saveTasks() {
    localStorage.setItem(
        "OurTasks",
        JSON.stringify(tasks)
    );
}


// =========================
// Update Statistics
// =========================

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.done
    ).length;

    const progress =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);


    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    progressPercent.textContent = `${progress}%`;

    progressText.textContent = `${progress}%`;

    progressBar.style.width = `${progress}%`;

    progressBar.setAttribute(
        "aria-valuenow",
        progress
    );
}


// =========================
// Empty State
// =========================

function showEmptyState(message = "No tasks yet") {

    taskList.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                ✓
            </div>

            <h3>${message}</h3>

            <p>
                ${
                    currentFilter === "all"
                        ? "Add your first task to get started."
                        : "There are no tasks in this category."
                }
            </p>

        </div>
    `;
}


// =========================
// Render Tasks
// =========================

function renderTasks() {

    let filteredTasks = tasks;


    if (currentFilter === "active") {

        filteredTasks = tasks.filter(
            task => !task.done
        );

    } else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.done
        );
    }


    if (filteredTasks.length === 0) {

        if (tasks.length === 0) {
            showEmptyState("No tasks yet");
        } else {
            showEmptyState("Nothing here");
        }

        updateStats();

        return;
    }


    taskList.innerHTML = filteredTasks
        .map(task => {

            const realIndex = tasks.indexOf(task);

            return `
                <div
                    class="task-item ${task.done ? "done" : ""}"
                    data-id="${realIndex}"
                >

                    <button
                        class="task-check"
                        data-action="toggle"
                        data-id="${realIndex}"
                        aria-label="Complete task"
                        type="button"
                    >
                        ✓
                    </button>


                    <div class="task-text">
                        ${escapeHTML(task.text)}
                    </div>


                    <div class="task-actions">

                        <button
                            type="button"
                            class="task-action btn-edit"
                            data-action="edit"
                            data-id="${realIndex}"
                            aria-label="Edit task"
                        >
                            ✎
                        </button>


                        <button
                            type="button"
                            class="task-action btn-remove"
                            data-action="delete"
                            data-id="${realIndex}"
                            aria-label="Delete task"
                        >
                            ×
                        </button>

                    </div>

                </div>
            `;
        })
        .join("");


    updateStats();
}


// =========================
// Escape HTML
// =========================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// =========================
// Add Task
// =========================

function addTask() {

    const text = taskInput.value.trim();


    if (!text) {

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: "Please enter a task",
            showConfirmButton: false,
            timer: 1800
        });

        return;
    }


    const exists = tasks.some(
        task =>
            task.text.toLowerCase() ===
            text.toLowerCase()
    );


    if (exists) {

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "This task already exists",
            showConfirmButton: false,
            timer: 1800
        });

        return;
    }


    tasks.push({
        text: text,
        done: false
    });


    saveTasks();

    taskInput.value = "";

    currentFilter = "all";

    updateFilterButtons();

    renderTasks();

    taskInput.focus();


    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Task added",
        showConfirmButton: false,
        timer: 1500
    });
}


// =========================
// Toggle Task
// =========================

function toggleTask(index) {

    if (!tasks[index]) {
        return;
    }


    tasks[index].done =
        !tasks[index].done;


    saveTasks();

    renderTasks();
}


// =========================
// Delete Task
// =========================

function deleteTask(index) {

    if (!tasks[index]) {
        return;
    }


    const taskName = tasks[index].text;


    Swal.fire({
        title: "Delete this task?",
        text: taskName,
        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",

        confirmButtonColor: "#dc2626"
    }).then(result => {

        if (result.isConfirmed) {

            tasks.splice(index, 1);

            saveTasks();

            renderTasks();


            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Task deleted",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}


// =========================
// Edit Task
// =========================

function editTask(index) {

    if (!tasks[index]) {
        return;
    }


    Swal.fire({

        title: "Edit task",

        input: "text",

        inputValue: tasks[index].text,

        inputPlaceholder: "Enter task",

        showCancelButton: true,

        confirmButtonText: "Save",

        cancelButtonText: "Cancel",

        inputValidator: value => {

            if (!value.trim()) {
                return "Task cannot be empty";
            }

        }

    }).then(result => {

        if (result.isConfirmed) {

            const newText =
                result.value.trim();


            const duplicate = tasks.some(
                (task, i) =>
                    i !== index &&
                    task.text.toLowerCase() ===
                    newText.toLowerCase()
            );


            if (duplicate) {

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "This task already exists",
                    showConfirmButton: false,
                    timer: 1800
                });

                return;
            }


            tasks[index].text = newText;

            saveTasks();

            renderTasks();


            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Task updated",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}


// =========================
// Finish All
// =========================

function finishAllTasks() {

    if (tasks.length === 0) {

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title: "There are no tasks",
            showConfirmButton: false,
            timer: 1500
        });

        return;
    }


    tasks.forEach(task => {
        task.done = true;
    });


    saveTasks();

    renderTasks();


    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "All tasks completed",
        showConfirmButton: false,
        timer: 1500
    });
}


// =========================
// Clear Completed
// =========================

function clearCompleted() {

    const completedCount =
        tasks.filter(task => task.done).length;


    if (completedCount === 0) {

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title: "No completed tasks",
            showConfirmButton: false,
            timer: 1500
        });

        return;
    }


    Swal.fire({

        title: "Clear completed tasks?",

        text: `${completedCount} completed task(s) will be removed.`,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Clear",

        cancelButtonText: "Cancel",

        confirmButtonColor: "#ea580c"

    }).then(result => {

        if (result.isConfirmed) {

            tasks = tasks.filter(
                task => !task.done
            );

            saveTasks();

            renderTasks();


            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Completed tasks cleared",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}


// =========================
// Delete All
// =========================

function deleteAllTasks() {

    if (tasks.length === 0) {

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title: "There are no tasks",
            showConfirmButton: false,
            timer: 1500
        });

        return;
    }


    Swal.fire({

        title: "Delete all tasks?",

        text: "This action cannot be undone.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Yes, delete all",

        cancelButtonText: "Cancel",

        confirmButtonColor: "#dc2626"

    }).then(result => {

        if (result.isConfirmed) {

            tasks = [];

            saveTasks();

            renderTasks();


            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "All tasks deleted",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}


// =========================
// Filters
// =========================

function updateFilterButtons() {

    filterButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );

    });
}


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter =
            button.dataset.filter;

        updateFilterButtons();

        renderTasks();

    });

});


// =========================
// Button Events
// =========================

btnAdd.addEventListener(
    "click",
    addTask
);


btnFinishAll.addEventListener(
    "click",
    finishAllTasks
);


btnClearCompleted.addEventListener(
    "click",
    clearCompleted
);


btnDeleteAll.addEventListener(
    "click",
    deleteAllTasks
);


// =========================
// Enter Key
// =========================

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            addTask();
        }

    }
);


// =========================
// Task Actions
// =========================

taskList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("button");


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;


        const index =
            Number(button.dataset.id);


        if (action === "toggle") {

            toggleTask(index);

        }

        else if (action === "edit") {

            editTask(index);

        }

        else if (action === "delete") {

            deleteTask(index);

        }

    }
);
