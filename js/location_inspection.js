// ==========================================
// Hospital Asset Management System
// Location Inspection (cross-department location search)
// ==========================================

// This tool is always global - it searches across every department,
// it doesn't filter by the currently selected department.

function statusBadge(status){

    let cls = "badge-working";

    if(status === "Under Repair"){
        cls = "badge-repair";
    } else if(status === "Condemned"){
        cls = "badge-condemned";
    }

    return `<span class="badge ${cls}">${status || "Working"}</span>`;

}

function renderRow(asset){

    const deptName = getDepartment(asset.departmentKey).name;

    return `
    <tr>
        <td>${asset.assetID}</td>
        <td>${asset.assetName}</td>
        <td>${deptName}</td>
        <td>${asset.block || "—"}</td>
        <td>${asset.section || "—"}</td>
        <td>${asset.location || "—"}</td>
        <td>${asset.subLocation || "—"}</td>
        <td>${statusBadge(asset.status)}</td>
    </tr>
    `;

}

function updateStats(assets){

    const table = document.getElementById("locationTable");

    const uniqueLocations = new Set(
        assets.map(a => [a.block, a.section, a.location, a.subLocation].filter(Boolean).join(" / "))
    );

    document.getElementById("statMatchingAssets").textContent = assets.length;
    document.getElementById("statUniqueLocations").textContent = uniqueLocations.size;

}

// -----------------------------
// Show All
// -----------------------------
function loadAllAssets(){

    const allAssets = JSON.parse(localStorage.getItem("Assets")) || [];

    const table = document.getElementById("locationTable");
    table.innerHTML = "";

    if(allAssets.length === 0){

        table.innerHTML = `<tr class="empty-row"><td colspan="8">No Assets Registered</td></tr>`;

        updateStats([]);

        return;

    }

    allAssets.forEach(asset => {
        table.innerHTML += renderRow(asset);
    });

    updateStats(allAssets);

}

// -----------------------------
// Search by dropdown selections
// -----------------------------
function searchLocation(){

    const blockVal = document.getElementById("block").value;
    const sectionVal = document.getElementById("section").value;
    const locationVal = document.getElementById("location").value;
    const subLocationVal = document.getElementById("subLocation").value;

    const table = document.getElementById("locationTable");

    if(!blockVal && !sectionVal && !locationVal && !subLocationVal){
        loadAllAssets();
        return;
    }

    const allAssets = JSON.parse(localStorage.getItem("Assets")) || [];

    const matches = allAssets.filter(asset =>
        (!blockVal || asset.block === blockVal) &&
        (!sectionVal || asset.section === sectionVal) &&
        (!locationVal || asset.location === locationVal) &&
        (!subLocationVal || asset.subLocation === subLocationVal)
    );

    table.innerHTML = "";

    if(matches.length === 0){

        table.innerHTML = `<tr class="empty-row"><td colspan="8">No assets found at that location</td></tr>`;

        updateStats([]);

        return;

    }

    matches.forEach(asset => {
        table.innerHTML += renderRow(asset);
    });

    updateStats(matches);

}

function clearLocationFilters(){

    document.getElementById("block").value = "";
    document.getElementById("section").innerHTML = '<option value="">All Sections</option>';
    document.getElementById("location").innerHTML = '<option value="">All Locations</option>';
    document.getElementById("subLocation").innerHTML = '<option value="">All Sub Locations</option>';

    loadAllAssets();

}

// Auto-search whenever any dropdown changes (hospital_locations.js already
// handles populating the next dropdown down - these listeners run in
// addition to that, to refresh the results table each time).
["block", "section", "location", "subLocation"].forEach(function(id){

    document.getElementById(id).addEventListener("change", function(){
        searchLocation();
    });

});

loadAllAssets();
