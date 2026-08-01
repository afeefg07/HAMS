// =====================================
// Hospital Asset Management System
// Asset Tracking
// =====================================

// Employee Name (only shown if the page has an #employee element)
const employee = localStorage.getItem("Employee");

const employeeEl = document.getElementById("employee");

if(employeeEl){
    employeeEl.innerHTML = employee ? "Employee : <b>" + employee + "</b>" : "Employee : Unknown";
}

// =====================================
// Department Title
// =====================================

const dept = localStorage.getItem("CurrentDepartment");

// Department name + Asset ID prefix now come from js/department_store.js
// (single shared source, managed via Admin > Department Management)
const currentDept = getDepartment(dept);

// Your HTML must contain:
// <h1 id="pageTitle"></h1>

document.getElementById("pageTitle").innerHTML =
    currentDept.name + " - Asset Tracking";

// =====================================
// Status Badge Helper
// =====================================
function statusBadge(status){

    let cls = "badge-working";

    if(status === "Under Repair"){
        cls = "badge-repair";
    } else if(status === "Condemned"){
        cls = "badge-condemned";
    }

    return `<span class="badge ${cls}">${status || "Working"}</span>`;

}

// =====================================
// Row Rendering Helper
// =====================================
// "fullIndex" is the asset's position in the COMPLETE Assets array
// (not the filtered/department-only list). Editing needs this so it
// updates the correct record.
function renderRow(asset, fullIndex){

    return `
    <tr>

        <td><img class="thumb" src="${asset.photo || '../images/no-image.png'}"></td>

        <td>${asset.assetID}</td>

        <td>${asset.assetName}</td>

        <td>${asset.manufacturer}</td>

        <td>${asset.model}</td>

        <td>${asset.serial}</td>

        <td>${asset.location}</td>

        <td>${asset.subLocation}</td>

        <td>${statusBadge(asset.status)}</td>

        <td>
            <div class="table-actions">
                <button class="btn-icon" onclick="editAsset(${fullIndex})" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>
                </button>
            </div>
        </td>

    </tr>
    `;

}

function editAsset(fullIndex){

    localStorage.setItem("SelectedAsset", fullIndex);

    window.location.href = "edit_asset.html";

}

// =====================================
// Load Assets
// =====================================

function loadAssets() {

    const table = document.getElementById("assetTable");
    table.innerHTML = "";

    let allAssets = JSON.parse(localStorage.getItem("Assets")) || [];

    // Keep track of each asset's real position in the full array
    // while filtering to just this department's assets.
    let assets = allAssets
        .map((asset, i) => ({ asset: asset, fullIndex: i }))
        .filter(item => item.asset.departmentKey === dept || item.asset.workDepartment === currentDept.code);

    if (assets.length === 0) {

        table.innerHTML = `
        <tr class="empty-row">
            <td colspan="10">No Assets Registered</td>
        </tr>
        `;

        return;
    }

    assets.forEach(item => {
        table.innerHTML += renderRow(item.asset, item.fullIndex);
    });

}

// =====================================
// Search
// =====================================

function searchAssets() {

    const keyword = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const table = document.getElementById("assetTable");

    table.innerHTML = "";

    let allAssets = JSON.parse(localStorage.getItem("Assets")) || [];

    let assets = allAssets
        .map((asset, i) => ({ asset: asset, fullIndex: i }))
        .filter(item => item.asset.departmentKey === dept || item.asset.workDepartment === currentDept.code);

    let filtered = assets.filter(item =>

        (item.asset.assetID || "").toLowerCase().includes(keyword) ||

        (item.asset.assetName || "").toLowerCase().includes(keyword) ||

        (item.asset.serial || "").toLowerCase().includes(keyword)

    );

    if(filtered.length === 0){

        table.innerHTML = `
        <tr class="empty-row">
            <td colspan="10">No Matching Asset Found</td>
        </tr>
        `;

        return;

    }

    filtered.forEach(item => {
        table.innerHTML += renderRow(item.asset, item.fullIndex);
    });

}

loadAssets();

// -----------------------------
// If we arrived here from the Department Dashboard search box,
// pre-fill the search and run it automatically.
// -----------------------------
const pendingSearch = localStorage.getItem("PendingSearch");

if(pendingSearch){

    document.getElementById("searchInput").value = pendingSearch;

    localStorage.removeItem("PendingSearch");

    searchAssets();

}
