
// HAMS - Assign Duty / Notifications shared data helpers

function getDuties(){
    return JSON.parse(localStorage.getItem("HAMS_Duties")) || [];
}
function saveDuties(list){
    localStorage.setItem("HAMS_Duties", JSON.stringify(list));
}
function getNotifications(){
    return JSON.parse(localStorage.getItem("HAMS_Notifications")) || [];
}
function saveNotifications(list){
    localStorage.setItem("HAMS_Notifications", JSON.stringify(list));
}

function dutyEmployeeName(employeeID){
    const employees = JSON.parse(localStorage.getItem("Employees")) || [];
    const e = employees.find(x => x.employeeID === employeeID);
    return e ? e.employeeName : "Unknown Employee";
}

function dutyDepartmentName(key){
    if(typeof getDepartment === "function") return getDepartment(key).name;
    return key || "—";
}

function createDutyNotification(duty){
    const list = getNotifications();
    list.unshift({
        notificationID: "NOT-" + Date.now() + "-" + Math.random().toString(36).slice(2,7),
        employeeID: duty.employeeID,
        type: "duty",
        title: "New Duty Assigned",
        message: `${duty.dutyType} for ${duty.assetName} (${duty.assetID})`,
        dutyID: duty.dutyID,
        createdAt: new Date().toISOString(),
        read: false
    });
    saveNotifications(list);
}

function unreadNotificationCount(employeeID){
    return getNotifications().filter(n => n.employeeID === employeeID && !n.read).length;
}

function renderNotificationBadge(elementID){
    const el = document.getElementById(elementID);
    if(!el) return;
    const count = unreadNotificationCount(localStorage.getItem("EmployeeID"));
    el.textContent = count;
    el.style.display = count ? "inline-flex" : "none";
}
