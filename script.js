const employeeForm = document.getElementById("employeeForm");
const employeeList = document.getElementById("employeeList");

let employees = JSON.parse(localStorage.getItem("employees")) || [];

function displayEmployees() {

    employeeList.innerHTML = "";

    employees.forEach(function(employee) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
        `;

        employeeList.appendChild(row);
    });
}

if (employeeForm) {

    employeeForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const employee = {
            name: document.getElementById("name").value,
            position: document.getElementById("position").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value
        };

        employees.push(employee);

        localStorage.setItem("employees", JSON.stringify(employees));

        employeeForm.reset();

    function displayEmployees() {

    employeeList.innerHTML = "";

    employees.forEach(function(employee, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>
                <button onclick="deleteEmployee(${index})">
                    Delete
                </button>
            </td>
        `;

        employeeList.appendChild(row);
    });
function deleteEmployee(index) {

    if (confirm("Are you sure you want to delete this employee?")) {

        employees.splice(index, 1);

        localStorage.setItem("employees", JSON.stringify(employees));

        displayEmployees();
    }
}
