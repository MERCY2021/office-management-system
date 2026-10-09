
const employeeForm = document.getElementById("employeeForm");
const employeeList = document.getElementById("employeeList");
const employeeSearch = document.getElementById("employeeSearch");
const submitButton = employeeForm
    ? employeeForm.querySelector("button[type='submit']")
    : null;

let employees = JSON.parse(localStorage.getItem("employees")) || [];

let editingIndex = -1;

// Display employees

function displayEmployees() {
    employeeList.innerHTML = "";

    const searchTerm = employeeSearch
        ? employeeSearch.value.toLowerCase().trim()
        : "";

    employees.forEach(function(employee, index) {
        const matchesSearch = [
            employee.name,
            employee.position,
            employee.email,
            employee.phone
        ].some(function(value) {
            return String(value || "")
                .toLowerCase()
                .includes(searchTerm);
        });

        if (!matchesSearch) return;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <button onclick="editEmployee(${index})">Edit</button>
                <button onclick="deleteEmployee(${index})">Delete</button>
            </td>
        `;

        row.cells[0].textContent = employee.name;
        row.cells[1].textContent = employee.position;
        row.cells[2].textContent = employee.email;
        row.cells[3].textContent = employee.phone;

        employeeList.appendChild(row);
    });
}


// Add or update employee
if (employeeForm) {

    employeeForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const employee = {
            name: document.getElementById("name").value,
            position: document.getElementById("position").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value
        };


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
