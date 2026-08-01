document.querySelector("button").addEventListener("click", login);

function login(){

    let username = document.getElementById("username").value.trim().toLowerCase();

    let password = document.getElementById("password").value;

    let employees = JSON.parse(localStorage.getItem("Employees")) || [];

    let user = employees.find(function(emp){

        return emp.username === username &&
               emp.password === password &&
               emp.status === "Active";

    });

    if(!user){

        alert("Invalid Username or Password");

        return;

    }

    localStorage.setItem("Employee", user.employeeName);
    localStorage.setItem("Username", user.username);
    localStorage.setItem("EmployeeID", user.employeeID);
    localStorage.setItem("Department", user.department);
    localStorage.setItem("Role", user.role);

    // ===============================
// Login History
// ===============================

let loginHistory =
JSON.parse(localStorage.getItem("LoginHistory")) || [];

loginHistory.unshift({

    employeeID:user.employeeID,

    employeeName:user.employeeName,

    username:user.username,

    department:user.department,

    role:user.role,

    date:new Date().toLocaleDateString(),

    time:new Date().toLocaleTimeString()

});

localStorage.setItem(
    "LoginHistory",
    JSON.stringify(loginHistory)
);

    window.location.href = "dashboard.html";

}