// ==========================================
// Hospital Asset Management System
// Authentication
// ==========================================

// Check Login

const employee = localStorage.getItem("Employee");

if (!employee) {

    alert("Please login first.");

    if (
        window.location.pathname.includes("/departments/") ||
        window.location.pathname.includes("/admin/")
    ) {

        window.location.href = "../index.html";

    } else {

        window.location.href = "index.html";

    }

}

// ==========================================
// Logout
// ==========================================

function logout(){

    if(confirm("Are you sure you want to logout?")){

        localStorage.removeItem("Employee");
        localStorage.removeItem("Username");
        localStorage.removeItem("EmployeeID");
        localStorage.removeItem("Department");
        localStorage.removeItem("Role");

        if(
            window.location.pathname.includes("/departments/") ||
            window.location.pathname.includes("/admin/")
        ){

            window.location.href="../index.html";

        }else{

            window.location.href="index.html";

        }

    }

}
// HAMS role helper for feature-level permissions.
function hamsCan(action){
 const role=(localStorage.getItem("Role")||"").toLowerCase();
 const rules={
   "manage_assets":["admin"],
   "assign_duty":["admin","manager","supervisor"],
   "inspect":["admin","manager","supervisor","employee","staff"],
   "reports":["admin","manager","supervisor"],
   "audit":["admin","manager","supervisor"]
 };
 return !rules[action] || rules[action].includes(role);
}
