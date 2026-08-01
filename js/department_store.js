// ==========================================
// Hospital Asset Management System
// Shared Department Store
// Used by: dashboard.html, js/asset_registration.js, admin/department_management.html
// This is the SINGLE source of truth for departments - edit them
// only through Department Management, not by hardcoding lists elsewhere.
// ==========================================

const DEFAULT_DEPARTMENTS = [
    { key:"biomedical",  name:"Biomedical Engineering", code:"BIO",  icon:"https://img.icons8.com/color/96/heart-with-pulse.png" },
    { key:"it",          name:"Information Technology", code:"IT",   icon:"https://img.icons8.com/color/96/server.png" },
    { key:"fire",        name:"Fire & Safety",          code:"FIRE", icon:"https://img.icons8.com/color/96/fire-extinguisher.png" },
    { key:"facilities",  name:"Facilities Management",  code:"FAC",  icon:"https://img.icons8.com/color/96/office.png" },
    { key:"engineering", name:"Engineering Support",    code:"ENG",  icon:"https://img.icons8.com/color/96/engineering.png" },
    { key:"food",        name:"Food & Beverage",        code:"FOOD", icon:"https://img.icons8.com/color/96/cutlery.png" }
];

// Get all departments. Seeds localStorage with the defaults the first time.
function getDepartments(){

    let departments = JSON.parse(localStorage.getItem("Departments"));

    if(!departments || departments.length === 0){
        departments = DEFAULT_DEPARTMENTS;
        localStorage.setItem("Departments", JSON.stringify(departments));
    }

    return departments;

}

function saveDepartments(departments){
    localStorage.setItem("Departments", JSON.stringify(departments));
}

// Look up one department by its key. Falls back to a safe placeholder
// instead of throwing, so pages never crash on an unknown/removed department.
function getDepartment(key){

    const departments = getDepartments();

    return departments.find(d => d.key === key) ||
           { key:key, name:"Unknown Department", code:"GEN", icon:"" };

}

// Turn a department name into a safe, unique internal key
// e.g. "Radiology & Imaging" -> "radiology_imaging"
function generateDepartmentKey(name){

    let base = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

    if(!base){
        base = "dept";
    }

    let key = base;
    let counter = 2;
    const departments = getDepartments();

    while(departments.some(d => d.key === key)){
        key = base + "_" + counter;
        counter++;
    }

    return key;

}
