// ==========================================
// Hospital Asset Management System
// Employee Management
// Phase 1
// ==========================================

// Employee Database
let employees = JSON.parse(localStorage.getItem("Employees")) || [];

// Edit Index
let editIndex = -1;

// ==========================================
// Generate Employee ID
// ==========================================

function generateEmployeeID(){

    let employees = JSON.parse(localStorage.getItem("Employees")) || [];

    let number = 1;

    while (employees.some(emp => emp.employeeID === "EMP" + String(number).padStart(6,"0"))) {
        number++;
    }

    document.getElementById("employeeID").value =
        "EMP" + String(number).padStart(6,"0");

}
generateEmployeeID();

// ==========================================
// Save Employee
// ==========================================

document.getElementById("employeeForm").addEventListener("submit",function(e){

    e.preventDefault();

    const employee={

        employeeID:document.getElementById("employeeID").value,

        employeeName:document.getElementById("employeeName").value.trim(),

        username:document.getElementById("username").value.trim().toLowerCase(),

        password:document.getElementById("password").value,

        email:document.getElementById("email").value,

        mobile:document.getElementById("mobile").value,

        department:document.getElementById("department").value,

        designation:document.getElementById("designation").value,

        role:document.getElementById("role").value,

        status:document.getElementById("status").value

    };

    // Empty Name

    if(employee.employeeName===""){

        alert("Enter Employee Name");

        return;

    }

    // Empty Username

    if(employee.username===""){

        alert("Enter Username");

        return;

    }

    // Empty Password

    if(employee.password===""){

        alert("Enter Password");

        return;

    }

    // Duplicate Username

    let duplicate = employees.find(function(emp){

        return emp.username===employee.username && emp.employeeID!==employee.employeeID;

    });

    if(duplicate){

        alert("Username already exists.");

        return;

    }

    // Edit Employee

    if(editIndex!=-1){

        employees[editIndex]=employee;

        editIndex=-1;

        alert("Employee Updated Successfully");

    }

    // New Employee

    else{

        employees.push(employee);

        alert("Employee Added Successfully");

    }

    // Save Database

    localStorage.setItem("Employees",JSON.stringify(employees));

    // Clear Form

    document.getElementById("employeeForm").reset();

    // Generate New ID

    generateEmployeeID();

    // Refresh Table (Phase 2)

    if(typeof loadEmployees==="function"){

        loadEmployees();

    }

});

// ==========================================
// Phase 2
// Load Employees
// Search
// Statistics
// ==========================================

// Load Employee Table

function loadEmployees(){

    employees = JSON.parse(localStorage.getItem("Employees")) || [];

    let keyword = document.getElementById("search").value.toLowerCase();

    let table = document.getElementById("employeeTable");

    table.innerHTML = "";

    let filtered = employees.filter(function(emp){

        return (

            emp.employeeID.toLowerCase().includes(keyword) ||

            emp.employeeName.toLowerCase().includes(keyword) ||

            emp.username.toLowerCase().includes(keyword) ||

            emp.department.toLowerCase().includes(keyword)

        );

    });

    if(filtered.length===0){

        table.innerHTML=`

        <tr>

            <td colspan="7" style="padding:25px;">

                No Employees Found

            </td>

        </tr>

        `;

    }

    else{

        filtered.forEach(function(emp,index){

            table.innerHTML += `

            <tr>

                <td>${emp.employeeID}</td>

                <td>${emp.employeeName}</td>

                <td>${emp.username}</td>

                <td>${emp.department}</td>

                <td>${emp.role}</td>

                <td>${emp.status}</td>

                <td>

                    <div class="action">

                        <button class="view"
                        onclick="viewEmployee(${index})">

                        👁

                        </button>

                        <button class="edit"
                        onclick="editEmployee(${index})">

                        ✏

                        </button>

                        <button class="reset"
                        onclick="resetPassword(${index})">

                        🔒

                        </button>

                        <button class="delete"
                        onclick="deleteEmployee(${index})">

                        🗑

                        </button>

                    </div>

                </td>

            </tr>

            `;

        });

    }

    updateStatistics();

}

// ==========================================
// Search
// ==========================================

document.getElementById("search").addEventListener("keyup",loadEmployees);

// ==========================================
// Statistics
// ==========================================

function updateStatistics(){

    let total = employees.length;

    let active = employees.filter(emp=>emp.status==="Active").length;

    let inactive = employees.filter(emp=>emp.status==="Inactive").length;

    let admins = employees.filter(emp=>emp.role==="Admin").length;

    document.getElementById("totalEmployees").innerHTML = total;

    document.getElementById("activeEmployees").innerHTML = active;

    document.getElementById("inactiveEmployees").innerHTML = inactive;

    document.getElementById("totalAdmins").innerHTML = admins;

}

// ==========================================
// First Load
// ==========================================

loadEmployees();

// ==========================================
// Phase 3
// View / Edit / Delete / Reset Password
// ==========================================

// ------------------------------
// View Employee
// ------------------------------
function viewEmployee(index){

    let emp = employees[index];

    alert(

        "Employee ID : " + emp.employeeID + "\n\n" +

        "Name : " + emp.employeeName + "\n" +

        "Username : " + emp.username + "\n" +

        "Department : " + emp.department + "\n" +

        "Designation : " + emp.designation + "\n" +

        "Role : " + emp.role + "\n" +

        "Status : " + emp.status + "\n" +

        "Email : " + emp.email + "\n" +

        "Mobile : " + emp.mobile

    );

}

// ------------------------------
// Edit Employee
// ------------------------------
function editEmployee(index){

    let emp = employees[index];

    editIndex = index;

    document.getElementById("employeeID").value = emp.employeeID;
    document.getElementById("employeeName").value = emp.employeeName;
    document.getElementById("username").value = emp.username;
    document.getElementById("password").value = emp.password;
    document.getElementById("email").value = emp.email;
    document.getElementById("mobile").value = emp.mobile;
    document.getElementById("department").value = emp.department;
    document.getElementById("designation").value = emp.designation;
    document.getElementById("role").value = emp.role;
    document.getElementById("status").value = emp.status;

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

// ------------------------------
// Delete Employee
// ------------------------------
function deleteEmployee(index){

    if(confirm("Delete this employee?")){

        employees.splice(index,1);

        localStorage.setItem(
            "Employees",
            JSON.stringify(employees)
        );

        loadEmployees();

        generateEmployeeID();

        alert("Employee Deleted.");

    }

}

// ------------------------------
// Reset Password
// ------------------------------
function resetPassword(index){

    let newPassword = prompt(
        "Enter New Password"
    );

    if(newPassword==null) return;

    if(newPassword.trim()==""){

        alert("Password cannot be empty.");

        return;

    }

    employees[index].password = newPassword;

    localStorage.setItem(
        "Employees",
        JSON.stringify(employees)
    );

    alert("Password Reset Successfully.");

}