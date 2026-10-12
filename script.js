
const employeeForm = document.getElementById("employeeForm");
const employeeList = document.getElementById("employeeList");
const employeeSearch = document.getElementById("employeeSearch");

const positionFilter = document.getElementById("positionFilter");
const employeeSort = document.getElementById("employeeSort");

const submitButton = employeeForm
    ? employeeForm.querySelector("button[type='submit']")
    : null;

let employees = JSON.parse(localStorage.getItem("employees")) || [];

let editingIndex = -1;

// Display employees

function displayEmployees() {
    employeeList.innerHTML = "";

    // Total employees
    const employeeCount = document.getElementById("employeeCount");
    if (employeeCount) {
        employeeCount.textContent = employees.length;
    }

    // Total unique positions
    const positionCount = document.getElementById("positionCount");
    if (positionCount) {
        const positions = employees
            .map(employee => String(employee.position || "").trim().toLowerCase())
            .filter(position => position !== "");

        positionCount.textContent = new Set(positions).size;
    }

    // Populate position dropdown
    if (positionFilter) {
        const selectedPosition = positionFilter.value;

        const uniquePositions = [...new Map(
            employees
                .map(employee => String(employee.position || "").trim())
                .filter(position => position !== "")
                .map(position => [position.toLowerCase(), position])
        ).values()].sort((a, b) => a.localeCompare(b));

        positionFilter.innerHTML = '<option value="">All Positions</option>';

        uniquePositions.forEach(position => {
            const option = document.createElement("option");
            option.value = position.toLowerCase();
            option.textContent = position;
            positionFilter.appendChild(option);
        });

        positionFilter.value = selectedPosition;
    }

    // Search and filter
    const searchTerm = employeeSearch
        ? employeeSearch.value.toLowerCase().trim()
        : "";

    const selectedPosition = positionFilter
        ? positionFilter.value
        : "";

    const sortOrder = employeeSort
        ? employeeSort.value
        : "name-asc";

    let displayedEmployees = employees
        .map((employee, index) => ({ employee, index }))
        .filter(({ employee }) => {
            const matchesSearch = [
                employee.name,
                employee.position,
                employee.email,
                employee.phone
            ].some(value =>
                String(value || "").toLowerCase().includes(searchTerm)
            );

            const matchesPosition = !selectedPosition ||
                String(employee.position || "").trim().toLowerCase() === selectedPosition;

            return matchesSearch && matchesPosition;
        });

    // Sort employees
    displayedEmployees.sort((a, b) => {
        const field = sortOrder.startsWith("position") ? "position" : "name";

        const first = String(a.employee[field] || "");
        const second = String(b.employee[field] || "");

        const comparison = first.localeCompare(second, undefined, {
            sensitivity: "base"
        });

        return sortOrder.endsWith("desc") ? -comparison : comparison;
    });

    // Display employee records
    displayedEmployees.forEach(({ employee, index }) => {
        const row = document.createElement("tr");

        [employee.name, employee.position, employee.email, employee.phone]
            .forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value || "";
                row.appendChild(cell);
            });

        const actions = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editEmployee(index);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteEmployee(index);

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        row.appendChild(actions);

        employeeList.appendChild(row);
    });
}

 // Add or update employee
if (employeeForm) {
    employeeForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const employee = {
            name: document.getElementById("name").value.trim(),
            position: document.getElementById("position").value.trim(),
            email: document.getElementById("email").value.trim().toLowerCase(),
            phone: document.getElementById("phone").value.trim()
        };

        // Prevent duplicate email addresses
        const duplicateEmail = employees.some((existingEmployee, index) => {
            return (
                index !== editingIndex &&
                String(existingEmployee.email || "").trim().toLowerCase() === employee.email
            );
        });

        if (duplicateEmail) {
            alert("This email address is already registered. Please use a different email.");
            return;
        }

        // Update existing employee
        if (editingIndex !== -1) {
            employees[editingIndex] = employee;
            editingIndex = -1;

            submitButton.textContent = "Add Employee";
        } else {
            // Add new employee
            employees.push(employee);
        }

        // Save changes
        localStorage.setItem("employees", JSON.stringify(employees));

        employeeForm.reset();
        displayEmployees();
    });
}



        // Update existing employee
        if (editingIndex !== -1) {

            employees[editingIndex] = employee;

            editingIndex = -1;

            submitButton.textContent = "Add Employee";

        }

        // Add new employee
        else {

            employees.push(employee);

        }


        localStorage.setItem("employees", JSON.stringify(employees));

        employeeForm.reset();

        displayEmployees();

    });
}


// Edit employee
function editEmployee(index) {

    const employee = employees[index];

    document.getElementById("name").value = employee.name;
    document.getElementById("position").value = employee.position;
    document.getElementById("email").value = employee.email;
    document.getElementById("phone").value = employee.phone;

    editingIndex = index;

    submitButton.textContent = "Update Employee";

}


// Delete employee
function deleteEmployee(index) {

    if (confirm("Are you sure you want to delete this employee?")) {

        employees.splice(index, 1);

        localStorage.setItem("employees", JSON.stringify(employees));

        displayEmployees();

    }
}


// Display employees when page opens
displayEmployees();
if (employeeSearch) {
    employeeSearch.addEventListener("input", displayEmployees);
}
if (positionFilter) {
    positionFilter.addEventListener("change", displayEmployees);
}

if (employeeSort) {
    employeeSort.addEventListener("change", displayEmployees);
}
