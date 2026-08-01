// ==========================================
// Hospital Asset Management System
// Edit Asset
// ==========================================

// Get Selected Asset
let index = localStorage.getItem("SelectedAsset");

let assets = JSON.parse(localStorage.getItem("Assets")) || [];

let asset = assets[index];

// -----------------------------
// Load Asset Details
// -----------------------------
if(asset){

    document.getElementById("previewImage").src = asset.photo || "../images/no-image.png";

    document.getElementById("assetID").value = asset.assetID || "";
    document.getElementById("assetName").value = asset.assetName || "";
    document.getElementById("manufacturer").value = asset.manufacturer || "";
    document.getElementById("model").value = asset.model || "";
    document.getElementById("serial").value = asset.serial || "";
    document.getElementById("category").value = asset.category || "";
    document.getElementById("subcategory").value = asset.subcategory || "";
    document.getElementById("division").value = asset.division || "";
    document.getElementById("block").value = asset.block || "";
    document.getElementById("section").value = asset.section || "";
    document.getElementById("location").value = asset.location || "";
    document.getElementById("subLocation").value = asset.subLocation || "";
    document.getElementById("department").value = asset.department || "";
    document.getElementById("workDepartment").value = asset.workDepartment || "";
    document.getElementById("assetType").value = asset.assetType || "";
    document.getElementById("custodian").value = asset.custodian || "";
    document.getElementById("usedBy").value = asset.usedBy || "";
    document.getElementById("status").value = asset.status || "";

} else {

    alert("No asset selected. Returning to Asset Management.");
    window.location.href = "asset_management.html";

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

    assets[index].assetName = assetName;
    assets[index].manufacturer = document.getElementById("manufacturer").value;
    assets[index].model = document.getElementById("model").value;
    assets[index].serial = document.getElementById("serial").value;
    assets[index].category = document.getElementById("category").value;
    assets[index].subcategory = document.getElementById("subcategory").value;
    assets[index].division = document.getElementById("division").value;
    assets[index].block = document.getElementById("block").value;
    assets[index].section = document.getElementById("section").value;
    assets[index].location = document.getElementById("location").value;
    assets[index].subLocation = document.getElementById("subLocation").value;
    assets[index].department = document.getElementById("department").value;
    assets[index].workDepartment = document.getElementById("workDepartment").value;
    assets[index].assetType = document.getElementById("assetType").value;
    assets[index].custodian = document.getElementById("custodian").value;
    assets[index].usedBy = document.getElementById("usedBy").value;
    assets[index].status = document.getElementById("status").value;

    localStorage.setItem("Assets", JSON.stringify(assets));

    alert("✅ Asset Updated Successfully!");

    window.location.href = "asset_management.html";

});
