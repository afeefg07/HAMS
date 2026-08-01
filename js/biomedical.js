// ===============================
// Biomedical Engineering Page
// Hospital Asset Management System
// ===============================

// Display logged-in employee
const employee = localStorage.getItem("Employee");

if(employee){
    document.getElementById("employeeName").textContent = employee;
}else{
    document.getElementById("employeeName").textContent = "Unknown User";
}

// Logout Function
function logout(){

    if(confirm("Are you sure you want to logout?")){

        localStorage.removeItem("Employee");
        localStorage.removeItem("Department");

        window.location.href="../index.html";

    }

}

// Display Current Date & Time
function updateDateTime(){

    const now = new Date();

    const options = {
        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"
    };

    const date = now.toLocaleDateString("en-US", options);
    const time = now.toLocaleTimeString();

    document.title = "Biomedical Engineering | " + time;

    console.log(date);
    console.log(time);

}

// Update every second
setInterval(updateDateTime,1000);