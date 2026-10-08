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

        displayEmployees();

        alert("Employee added successfully!");
    });

    displayEmployees();
}
