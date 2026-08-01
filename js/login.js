document.querySelector("button").addEventListener("click", login);

// ===================================================
// Create Default Admin Account (First Run Only)
// ===================================================
if (!localStorage.getItem("Employees")) {

    const defaultEmployees = [
        {
            employeeID: "ADMIN001",
            employeeName: "Administrator",
            username: "afeef",
            password: "123456",
            department: "Administration",
            role: "Admin",
            status: "Active"
        }
    ];

    localStorage.setItem("Employees", JSON.stringify(defaultEmployees));
}

// ===================================================
// Login Function
// ===================================================
function login() {

    let username = document.getElementById("username").value.trim().toLowerCase();
    let password = document.getElementById("password").value;

    let employees = JSON.parse(localStorage.getItem("Employees")) || [];

    let user = employees.find(function (emp) {

        return (
            emp.username.toLowerCase() === username &&
            emp.password === password &&
            emp.status === "Active"
        );

    });

    if (!user) {

        alert("Invalid Username or Password");
        return;

    }

    // Save Current User
    localStorage.setItem("Employee", user.employeeName);
    localStorage.setItem("Username", user.username);
    localStorage.setItem("EmployeeID", user.employeeID);
    localStorage.setItem("Department", user.department);
    localStorage.setItem("Role", user.role);

    // ===================================================
    // Login History
    // ===================================================

    let loginHistory = JSON.parse(localStorage.getItem("LoginHistory")) || [];

    loginHistory.unshift({

        employeeID: user.employeeID,
        employeeName: user.employeeName,
        username: user.username,
        department: user.department,
        role: user.role,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()

    });

    localStorage.setItem("LoginHistory", JSON.stringify(loginHistory));

    // Go Dashboard
    window.location.href = "dashboard.html";

}
