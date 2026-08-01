// ==========================================
// Hospital Asset Management System
// Asset Registration
// Self-contained: no external departments.js needed
// ==========================================

// -----------------------------
// Department Data now comes from js/department_store.js
// (single shared source, managed via Admin > Department Management)
// -----------------------------

const currentDepartment = localStorage.getItem("CurrentDepartment");

const department = getDepartment(currentDepartment);

// -----------------------------
// Show Employee Name (only if the page has an #employee element)
// -----------------------------
const employee = localStorage.getItem("Employee");

const employeeEl = document.getElementById("employee");

if(employeeEl){
    employeeEl.innerHTML = "Employee : <b>" + (employee || "Unknown") + "</b>";
}

// -----------------------------
// Populate Department Fields
// -----------------------------
function populateDepartmentFields(){

    document.getElementById("department").value = department.name;

    const workDepartmentField = document.getElementById("workDepartment");
    workDepartmentField.value = department.code;
    workDepartmentField.readOnly = true;

}
populateDepartmentFields();

// -----------------------------
// Generate Asset ID
// -----------------------------
function generateAssetID(){

    // Global prefix and starting number - the NUMBER portion is shared
    // and continuous across ALL departments (KNR-BIO-10000, KNR-IT-10001,
    // KNR-FIRE-10002, ...). The department code is included so the asset's
    // owning department is visible directly in the ID, but it does NOT
    // reset or restart the numbering - it's still one running sequence.
    const GLOBAL_PREFIX = "KNR";
    const STARTING_NUMBER = 10000;
    const deptCode = department.code;

    let assets = JSON.parse(localStorage.getItem("Assets")) || [];

    let maxNumber = STARTING_NUMBER - 1;

    assets.forEach(asset => {

        if(asset.assetID && asset.assetID.startsWith(GLOBAL_PREFIX + "-")){

            const parts = asset.assetID.split("-");
            const number = parseInt(parts[parts.length - 1]);

            if(!isNaN(number) && number > maxNumber){
                maxNumber = number;
            }

        }

    });

    let nextNumber = maxNumber + 1;

    document.getElementById("assetId").value =
        GLOBAL_PREFIX + "-" + deptCode + "-" + nextNumber;

}
generateAssetID();

// -----------------------------
// Image Preview + Validation
// -----------------------------
const ALLOWED_IMAGE_TYPES = ["image/jpeg","image/jpg","image/png","image/webp"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

const photo = document.getElementById("assetPhoto");

const preview = document.getElementById("previewImage");

photo.addEventListener("change", function(){

    const file = this.files[0];

    if(!file){
        return;
    }

    if(!ALLOWED_IMAGE_TYPES.includes(file.type)){

        showToast("Only JPG, JPEG, PNG or WEBP images are allowed.", "error");
        this.value = "";
        return;

    }

    if(file.size > MAX_IMAGE_SIZE){

        showToast("Image must be smaller than 2 MB.", "error");
        this.value = "";
        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        preview.src = e.target.result;

    };

    reader.readAsDataURL(file);

});

// -----------------------------
// Save Asset
// -----------------------------
document.getElementById("assetForm").addEventListener("submit", function(e){

    e.preventDefault();

    const assetName = document.getElementById("assetName").value.trim();
    const manufacturer = document.getElementById("manufacturer").value.trim();
    const model = document.getElementById("model").value.trim();
    const serial = document.getElementById("serial").value.trim();
    const assetID = document.getElementById("assetId").value.trim();

    // -----------------------------
    // Validation
    // -----------------------------
    if(!assetName){
        showToast("Asset Name is required.", "error");
        return;
    }

    let assets = JSON.parse(localStorage.getItem("Assets")) || [];

    const duplicateSerial = serial && assets.some(a => a.serial && a.serial.toLowerCase() === serial.toLowerCase());

    if(duplicateSerial){
        showToast("An asset with this Serial Number already exists.", "error");
        return;
    }

    const duplicateID = assets.some(a => a.assetID === assetID);

    if(duplicateID){
        showToast("Asset ID already exists. Please retry.", "error");
        generateAssetID();
        return;
    }

    const asset = {

        assetID: assetID,

        assetName: assetName,

        manufacturer: manufacturer,

        model: model,

        serial: serial,

        category: document.getElementById("category").value,

        subcategory: document.getElementById("subcategory").value,

        division: document.getElementById("division").value,

        block: document.getElementById("block").value,

        section: document.getElementById("section").value,

        location: document.getElementById("location").value,

        subLocation: document.getElementById("subLocation").value,

        department: department.name,

        departmentKey: currentDepartment,

        workDepartment: department.code,

        assetType: document.getElementById("assetType").value,

        custodian: document.getElementById("custodian").value,

        usedBy: document.getElementById("usedBy").value,

        status: document.getElementById("status").value,

        photo: preview.src

    };

    // Add New Asset
    assets.push(asset);

    // Save Assets
    localStorage.setItem("Assets", JSON.stringify(assets));

    showToast("Asset Registered Successfully!", "success");

    document.getElementById("assetForm").reset();

    preview.src = "../images/no-image.png";

    // Restore department fields (reset() clears them since they have no default value attribute)
    populateDepartmentFields();

    // Generate Next Asset ID
    generateAssetID();

});

// -----------------------------
// Bulk Import (CSV)
// -----------------------------

// Columns expected in the CSV template, in order.
// Asset ID / Division / Department / Work Department are auto-filled, so they are NOT in the template.
const BULK_COLUMNS = [
    "Asset Name", "Manufacturer", "Model", "Serial Number",
    "Category", "Sub Category", "Block", "Section", "Location",
    "Sub Location", "Asset Type", "Custodian", "Used By", "Status"
];

// Download a starter CSV template
document.getElementById("downloadTemplateBtn").addEventListener("click", function(){

    const sampleRow = [
        "Infusion Pump", "BD Alaris", "8100", "SN-12345",
        "Medical Equipment", "Pumps", "Main Block", "ICU",
        "ICU Room 2", "Bed 3", "Owned", "Dr. Sharma", "ICU Ward", "Working"
    ];

    const csvContent = BULK_COLUMNS.join(",") + "\n" +
        sampleRow.map(v => `"${v}"`).join(",");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "asset_bulk_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

});

// Show chosen file name
const bulkCsvFile = document.getElementById("bulkCsvFile");
bulkCsvFile.addEventListener("change", function(){
    document.getElementById("bulkFileName").textContent =
        this.files[0] ? "Selected file: " + this.files[0].name : "";
});

// Minimal CSV line parser (handles quoted fields with commas)
function parseCsvLine(line){
    const result = [];
    let current = "";
    let inQuotes = false;

    for(let i = 0; i < line.length; i++){
        const char = line[i];

        if(char === '"'){
            if(inQuotes && line[i + 1] === '"'){
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if(char === "," && !inQuotes){
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

function parseCsv(text){
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
    if(lines.length === 0){
        return [];
    }

    const headers = parseCsvLine(lines[0]).map(h => h.trim());

    return lines.slice(1).map(line => {
        const values = parseCsvLine(line);
        const row = {};
        headers.forEach((header, i) => {
            row[header] = (values[i] || "").trim();
        });
        return row;
    });
}

document.getElementById("bulkImportBtn").addEventListener("click", function(){

    const file = bulkCsvFile.files[0];

    if(!file){
        showToast("Please choose a CSV file first.", "error");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){

        const rows = parseCsv(e.target.result);

        if(rows.length === 0){
            showToast("The CSV file has no data rows.", "error");
            return;
        }

        let assets = JSON.parse(localStorage.getItem("Assets")) || [];

        // Same global counter as single-entry registration - shared across
        // ALL departments. Department code is embedded in the ID but the
        // NUMBER portion keeps counting up as one continuous sequence.
        const GLOBAL_PREFIX = "KNR";
        const STARTING_NUMBER = 10000;
        const deptCode = department.code;

        let maxNumber = STARTING_NUMBER - 1;
        assets.forEach(asset => {
            if(asset.assetID && asset.assetID.startsWith(GLOBAL_PREFIX + "-")){
                const parts = asset.assetID.split("-");
                const number = parseInt(parts[parts.length - 1]);
                if(!isNaN(number) && number > maxNumber){
                    maxNumber = number;
                }
            }
        });

        let importedCount = 0;
        let skippedRows = [];

        rows.forEach((row, index) => {

            const assetName = (row["Asset Name"] || "").trim();
            const serial = (row["Serial Number"] || "").trim();

            // Asset Name is the only required field, matching the single-entry form
            if(!assetName){
                skippedRows.push(`Row ${index + 2}: missing Asset Name`);
                return;
            }

            if(serial){
                const duplicateSerial = assets.some(a => a.serial && a.serial.toLowerCase() === serial.toLowerCase());
                if(duplicateSerial){
                    skippedRows.push(`Row ${index + 2}: Serial Number "${serial}" already exists`);
                    return;
                }
            }

            maxNumber++;
            const assetID = GLOBAL_PREFIX + "-" + deptCode + "-" + maxNumber;

            const asset = {

                assetID: assetID,
                assetName: assetName,
                manufacturer: (row["Manufacturer"] || "").trim(),
                model: (row["Model"] || "").trim(),
                serial: serial,
                category: (row["Category"] || "").trim(),
                subcategory: (row["Sub Category"] || "").trim(),
                division: "BMH Kannur",
                block: (row["Block"] || "").trim(),
                section: (row["Section"] || "").trim(),
                location: (row["Location"] || "").trim(),
                subLocation: (row["Sub Location"] || "").trim(),
                department: department.name,
                departmentKey: currentDepartment,
                workDepartment: department.code,
                assetType: (row["Asset Type"] || "Owned").trim(),
                custodian: (row["Custodian"] || "").trim(),
                usedBy: (row["Used By"] || "").trim(),
                status: (row["Status"] || "Working").trim(),
                photo: "../images/no-image.png"

            };

            assets.push(asset);
            importedCount++;

        });

        localStorage.setItem("Assets", JSON.stringify(assets));

        const resultsDiv = document.getElementById("bulkResults");
        let summaryHtml = `<p style="color:#1e8e3e;font-weight:bold;">✅ ${importedCount} asset(s) imported successfully.</p>`;

        if(skippedRows.length > 0){
            summaryHtml += `<p style="color:#c0392b;font-weight:bold;margin-top:8px;">⚠️ ${skippedRows.length} row(s) skipped:</p>`;
            summaryHtml += "<ul style='color:#c0392b;font-size:14px;margin-left:20px;'>" +
                skippedRows.map(msg => `<li>${msg}</li>`).join("") +
                "</ul>";
        }

        resultsDiv.innerHTML = summaryHtml;

        if(importedCount > 0){
            showToast(importedCount + " asset(s) imported successfully!", "success");
        }

        bulkCsvFile.value = "";
        document.getElementById("bulkFileName").textContent = "";

        // Refresh the next single-entry Asset ID so it doesn't collide with imported ones
        generateAssetID();

    };

    reader.readAsText(file);

});

// -----------------------------
// Toast Notification
// -----------------------------
function showToast(message, type){

    const existing = document.getElementById("assetToast");
    if(existing){
        existing.remove();
    }

    const toast = document.createElement("div");
    toast.id = "assetToast";
    toast.className = "hams-toast " + (type === "error" ? "error" : "success");
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(function(){
        toast.style.opacity = "0";
        setTimeout(function(){ toast.remove(); }, 400);
    }, 2500);

}
