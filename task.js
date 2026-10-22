
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const assignedEmployee = document.getElementById("assignedEmployee");
const taskDeadline = document.getElementById("taskDeadline");
const taskPriority = document.getElementById("taskPriority");
const taskStatus = document.getElementById("taskStatus");
const taskSearch = document.getElementById("taskSearch");
const statusFilter = document.getElementById("statusFilter");
const taskList = document.getElementById("taskList");
// Task summary counters
const totalTaskCount = document.getElementById("totalTaskCount");
const pendingTaskCount = document.getElementById("pendingTaskCount");
const completedTaskCount = document.getElementById("completedTaskCount");

// Update task summary cards
function updateTaskCounts() {
    totalTaskCount.textContent = tasks.length;

    pendingTaskCount.textContent = tasks.filter(
        task => task.status === "Pending"
    ).length;

    completedTaskCount.textContent = tasks.filter(
        task => task.status === "Completed"
    ).length;
}

let tasks = JSON.parse(localStorage.getItem("officeTasks")) || [];
let editingTaskId = null;

function getEmployees() {
    try {
        const savedEmployees = localStorage.getItem("employees");

        if (!savedEmployees) {
            return [];
        }

        const employees = JSON.parse(savedEmployees);

        return Array.isArray(employees) ? employees : [];
    } catch (error) {
        console.error("Could not load employee records:", error);
        return [];
    }
}
function saveTasks() {
    localStorage.setItem("officeTasks", JSON.stringify(tasks));
}

function loadEmployees() {
    const employees = getEmployees();
    const previousValue = assignedEmployee.value;

    assignedEmployee.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select an employee";
    assignedEmployee.appendChild(defaultOption);

    employees.forEach(employee => {
        const option = document.createElement("option");
        option.value = employee.email;
        option.textContent = employee.name + " (" + employee.position + ")";
        assignedEmployee.appendChild(option);
    });

    if (employees.some(employee => employee.email === previousValue)) {
        assignedEmployee.value = previousValue;
    }
}
// Load employees when the Tasks page opens
document.addEventListener("DOMContentLoaded", loadEmployees);

// Refresh the list when the employee dropdown is opened
assignedEmployee.addEventListener("focus", loadEmployees);
assignedEmployee.addEventListener("click", loadEmployees);
function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value || "—";
    return cell;
}

function renderTasks() {
        updateTaskCounts();
    const searchTerm = taskSearch.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;

    taskList.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        const matchesSearch =
            (task.title || "").toLowerCase().includes(searchTerm) ||
            (task.employeeName || "").toLowerCase().includes(searchTerm) ||
            (task.description || "").toLowerCase().includes(searchTerm);

        const matchesStatus =
            !selectedStatus || task.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    if (filteredTasks.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.textContent = tasks.length
            ? "No matching tasks found."
            : "No tasks yet. Assign your first task above.";
        row.appendChild(cell);
        taskList.appendChild(row);
        return;
    }

    filteredTasks.forEach(task => {
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        const title = document.createElement("strong");
        title.textContent = task.title;
        titleCell.appendChild(title);

        if (task.description) {
            const description = document.createElement("p");
            description.textContent = task.description;
            titleCell.appendChild(description);
        }

        row.appendChild(titleCell);
        row.appendChild(createCell(task.employeeName));
        row.appendChild(createCell(task.deadline));
        row.appendChild(createCell(task.priority));
        row.appendChild(createCell(task.status));

        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.dataset.action = "edit";
        editButton.dataset.id = task.id;
        actionsCell.appendChild(editButton);

        if (task.status !== "Completed") {
            const completeButton = document.createElement("button");
            completeButton.type = "button";
            completeButton.textContent = "Complete";
            completeButton.dataset.action = "complete";
            completeButton.dataset.id = task.id;
            actionsCell.appendChild(completeButton);
        }

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = task.id;
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        taskList.appendChild(row);
    });
}

function resetTaskForm() {
    taskForm.reset();
    editingTaskId = null;
    taskForm.querySelector('button[type="submit"]').textContent =
        "Assign Task";

    const cancelButton = document.getElementById("cancelTaskEdit");
    if (cancelButton) cancelButton.hidden = true;

    loadEmployees();
}

const cancelButton = document.createElement("button");
cancelButton.type = "button";
cancelButton.id = "cancelTaskEdit";
cancelButton.textContent = "Cancel Edit";
cancelButton.hidden = true;
cancelButton.addEventListener("click", resetTaskForm);
taskForm.appendChild(cancelButton);

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const employees = getEmployees();
    const employee = employees.find(
        item => item.email === assignedEmployee.value
    );

    if (!employee) {
        alert("Please select an employee registered in Employee Management.");
        return;
    }

    const taskData = {
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        employeeEmail: employee.email,
        employeeName: employee.name,
        deadline: taskDeadline.value,
        priority: taskPriority.value,
        status: taskStatus.value
    };

    if (!taskData.title || !taskData.deadline) {
        alert("Please enter a task title and deadline.");
        return;
    }

    if (editingTaskId !== null) {
        const index = tasks.findIndex(task => task.id === editingTaskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...taskData };
        }
    } else {
        tasks.push({
            id: String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
            ...taskData
        });
    }

    saveTasks();
    renderTasks();
    resetTaskForm();
});

taskList.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const task = tasks.find(item => item.id === button.dataset.id);
    if (!task) return;

    if (button.dataset.action === "edit") {
        loadEmployees();
        

        const employees = getEmployees();
        const employeeExists = employees.some(
            employee => employee.email === task.employeeEmail
        );

        if (!employeeExists) {
            alert("This task's employee is no longer in the employee list. Please check Employee Management first.");
            return;
        }

        editingTaskId = task.id;
        taskTitle.value = task.title;
        taskDescription.value = task.description || "";
        assignedEmployee.value = task.employeeEmail;
        taskDeadline.value = task.deadline;
        taskPriority.value = task.priority;
        taskStatus.value = task.status;

        taskForm.querySelector('button[type="submit"]').textContent =
            "Save Changes";
        cancelButton.hidden = false;
        taskForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (button.dataset.action === "complete") {
        task.status = "Completed";
        saveTasks();
        renderTasks();
    }

    if (button.dataset.action === "delete") {
        if (confirm("Are you sure you want to delete this task?")) {
            tasks = tasks.filter(item => item.id !== task.id);

            if (editingTaskId === task.id) {
                resetTaskForm();
            }

            saveTasks();
            renderTasks();
        }
    }
});

taskSearch.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);

loadEmployees();
renderTasks();
