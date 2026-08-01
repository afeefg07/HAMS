// ==========================================
// Hospital Asset Management System
// Department Edit Asset (employee-facing)
// Restricted to assets belonging to the employee's own department
// ==========================================

const dept = localStorage.getItem("CurrentDepartment");

const currentDept = getDepartment(dept);

let assets = JSON.parse(localStorage.getItem("Assets")) || [];

// The index is the position in the FULL Assets array (set by asset_tracking.js),
// not the position in the filtered department list.
let index = localStorage.getItem("SelectedAsset");

let asset = assets[index];

// -----------------------------
// Security check: an employee can only edit assets from their OWN department.
// This blocks editing another department's asset even if someone tries to
// manually change the stored index.
// -----------------------------
if(!asset || asset.workDepartment !== currentDept.code){

    alert("You can only edit assets belonging to your own department.");
    window.location.href = "asset_tracking.html";

} else {

    document.getElementById("previewImage").src = asset.photo || "../images/no-image.png";

    document.getElementById("assetID").value = asset.assetID || "";
    document.getElementById("assetName").value = asset.assetName || "";
    document.getElementById("manufacturer").value = asset.manufacturer || "";
    document.getElementById("model").value = asset.model || "";
    document.getElementById("serial").value = asset.serial || "";
    document.getElementById("category").value = asset.category || "";
    document.getElementById("subcategory").value = asset.subcategory || "";
    document.getElementById("block").value = asset.block || "";
    document.getElementById("section").value = asset.section || "";
    document.getElementById("location").value = asset.location || "";
    document.getElementById("subLocation").value = asset.subLocation || "";
    document.getElementById("assetType").value = asset.assetType || "";
    document.getElementById("custodian").value = asset.custodian || "";
    document.getElementById("usedBy").value = asset.usedBy || "";
    document.getElementById("status").value = asset.status || "";

}

// -----------------------------
// Save Changes
// -----------------------------
document.getElementById("editForm").addEventListener("submit", function(e){

    e.preventDefault();

    const assetName = document.getElementById("assetName").value.trim();

    if(!assetName){
        alert("Asset Name is required.");
        return;
    }

    // Re-check department ownership at save time too
    if(assets[index].workDepartment !== currentDept.code){
        alert("You can only edit assets belonging to your own department.");
        window.location.href = "asset_tracking.html";
        return;
    }

    assets[index].assetName = assetName;
    assets[index].manufacturer = document.getElementById("manufacturer").value;
    assets[index].model = document.getElementById("model").value;
    assets[index].serial = document.getElementById("serial").value;
    assets[index].category = document.getElementById("category").value;
    assets[index].subcategory = document.getElementById("subcategory").value;
    assets[index].block = document.getElementById("block").value;
    assets[index].section = document.getElementById("section").value;
    assets[index].location = document.getElementById("location").value;
    assets[index].subLocation = document.getElementById("subLocation").value;
    assets[index].assetType = document.getElementById("assetType").value;
    assets[index].custodian = document.getElementById("custodian").value;
    assets[index].usedBy = document.getElementById("usedBy").value;
    assets[index].status = document.getElementById("status").value;

    localStorage.setItem("Assets", JSON.stringify(assets));

    alert("✅ Asset Updated Successfully!");

    window.location.href = "asset_tracking.html";

});
