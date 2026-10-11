
const employees = JSON.parse(
    localStorage.getItem("employees")
) || [];

const totalEmployees = document.getElementById("totalEmployees");

if (totalEmployees) {
    totalEmployees.textContent = employees.length;
}
