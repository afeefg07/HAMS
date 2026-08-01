// ==========================================
// Hospital Asset Management System
// Verify Asset (direct button - no camera/QR)
// ==========================================

const dept = localStorage.getItem("CurrentDepartment");
const employee = localStorage.getItem("Employee") || "Unknown";

const currentDept = getDepartment(dept);

// If opened as asset_verify.html?scope=all (from the main dashboard's
// "Tools" section), show every department's assets together instead of
// filtering to just one department.
const urlParams = new URLSearchParams(window.location.search);
const isGlobalScope = urlParams.get("scope") === "all";
const filterParam = urlParams.get("filter"); // "verified" | "unverified" | null

// -----------------------------
// Load + Render Table
// -----------------------------
function loadAssets(){

    const allAssets = JSON.parse(localStorage.getItem("Assets")) || [];

    // Verify Asset shows ALL department assets - this is the first step
    // in the workflow (verify before it becomes eligible for inspection).
    // In global scope, show assets from EVERY department.
    let deptAssets = isGlobalScope
        ? allAssets
        : allAssets.filter(a => a.departmentKey === dept || a.workDepartment === currentDept.code);

    // Optional filter from the dashboard's stat tiles (?filter=verified / unverified)
    if(filterParam === "verified"){
        deptAssets = deptAssets.filter(a => a.verified === true);
    } else if(filterParam === "unverified"){
        deptAssets = deptAssets.filter(a => !a.verified);
    }

    // Department filter (only shown/used in global scope)
    const deptFilterEl = document.getElementById("filterDept");
    const deptFilterVal = deptFilterEl ? deptFilterEl.value : "";

    if(deptFilterVal){
        deptAssets = deptAssets.filter(a => a.departmentKey === deptFilterVal);
    }

    // Location filters (Block / Section / Location / Sub Location)
    const blockVal = document.getElementById("block").value;
    const sectionVal = document.getElementById("section").value;
    const locationVal = document.getElementById("location").value;
    const subLocationVal = document.getElementById("subLocation").value;

    deptAssets = deptAssets.filter(a =>
        (!blockVal || a.block === blockVal) &&
        (!sectionVal || a.section === sectionVal) &&
        (!locationVal || a.location === locationVal) &&
        (!subLocationVal || a.subLocation === subLocationVal)
    );

    const table = document.getElementById("verifyTable");
    table.innerHTML = "";

    if(deptAssets.length === 0){

        const colspan = isGlobalScope ? 6 : 5;
        table.innerHTML = `<tr class="empty-row"><td colspan="${colspan}">No assets match these filters</td></tr>`;

        updateStats([]);

        return;

    }

    deptAssets.forEach(function(asset){

        const row = document.createElement("tr");

        const verifiedInfo = asset.verified
            ? `Verified by ${asset.verifiedBy || "Unknown"}<br><span style="font-size:11.5px;color:var(--color-muted);">${new Date(asset.verifiedDate).toLocaleString()}</span>`
            : "—";

        const deptCell = isGlobalScope
            ? `<td>${getDepartment(asset.departmentKey).name}</td>`
            : "";

        row.innerHTML = `
            <td>${asset.assetID}</td>
            <td>${asset.assetName}</td>
            ${deptCell}
            <td>
                <span class="status-dot ${asset.verified ? "verified" : "unverified"}"></span>
                ${asset.verified ? "Verified" : "Unverified"}
                <div style="font-size:12px;margin-top:4px;">${verifiedInfo}</div>
            </td>
            <td>
                <button class="btn-icon" onclick="openDetailModal('${asset.assetID}')" title="View Details">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
            </td>
            <td style="display:flex;gap:8px;flex-wrap:wrap;">
                ${asset.verified
                    ? `<button class="btn btn-secondary" style="padding:8px 14px;font-size:13px;" onclick="unverifyAsset('${asset.assetID}', '${(asset.assetName || "").replace(/'/g, "\\'")}')">↩ Unverify</button>`
                    : `<button class="btn btn-primary" style="padding:8px 14px;font-size:13px;" onclick="verifyAsset('${asset.assetID}', '${(asset.assetName || "").replace(/'/g, "\\'")}')">✅ Verify</button>`
                }
            </td>
        `;

        table.appendChild(row);

    });

    updateStats(deptAssets);

}

function updateStats(deptAssets){

    const verifiedCount = deptAssets.filter(a => a.verified).length;
    const unverifiedCount = deptAssets.length - verifiedCount;

    document.getElementById("statVerified").textContent = verifiedCount;
    document.getElementById("statUnverified").textContent = unverifiedCount;

}

// -----------------------------
// Direct Verify (no camera/QR)
// -----------------------------
function verifyAsset(assetID, assetName){

    if(!confirm("Confirm you have physically checked \"" + assetName + "\" (" + assetID + ") and it is present?")){
        return;
    }

    let assets = JSON.parse(localStorage.getItem("Assets")) || [];

    const idx = assets.findIndex(a => a.assetID === assetID);

    if(idx > -1){

        assets[idx].verified = true;
        assets[idx].verifiedBy = employee;
        assets[idx].verifiedDate = new Date().toISOString();

        localStorage.setItem("Assets", JSON.stringify(assets));

    }

    loadAssets();

}

// -----------------------------
// Undo a verification (e.g. verified the wrong asset by mistake)
// -----------------------------
function unverifyAsset(assetID, assetName){

    const inspections = JSON.parse(localStorage.getItem("Inspections")) || [];
    const hasInspectionHistory = inspections.some(i => i.assetID === assetID);

    let message = "Remove verification for \"" + assetName + "\"?";

    if(hasInspectionHistory){
        message += "\n\nNote: this asset has inspection history. It will disappear from Asset Inspection until it's verified again, but its inspection records will NOT be deleted.";
    }

    if(!confirm(message)){
        return;
    }

    let assets = JSON.parse(localStorage.getItem("Assets")) || [];

    const idx = assets.findIndex(a => a.assetID === assetID);

    if(idx > -1){

        assets[idx].verified = false;
        delete assets[idx].verifiedBy;
        delete assets[idx].verifiedDate;

        localStorage.setItem("Assets", JSON.stringify(assets));

    }

    loadAssets();

}

// -----------------------------
// Asset Detail Modal
// -----------------------------
function openDetailModal(assetID){

    const assets = JSON.parse(localStorage.getItem("Assets")) || [];
    const inspections = JSON.parse(localStorage.getItem("Inspections")) || [];

    const asset = assets.find(a => a.assetID === assetID);

    if(!asset){
        return;
    }

    const history = inspections
        .filter(i => i.assetID === assetID)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const fields = [
        ["Asset ID", asset.assetID],
        ["Asset Name", asset.assetName],
        ["Manufacturer", asset.manufacturer],
        ["Model", asset.model],
        ["Serial Number", asset.serial],
        ["Category", asset.category],
        ["Sub Category", asset.subcategory],
        ["Block", asset.block],
        ["Section", asset.section],
        ["Location", asset.location],
        ["Sub Location", asset.subLocation],
        ["Asset Type", asset.assetType],
        ["Custodian", asset.custodian],
        ["Used By", asset.usedBy],
        ["Status", asset.status],
        ["Verification", asset.verified ? "✅ Verified" : "❌ Unverified"],
        ["Verified By", asset.verifiedBy || "—"],
        ["Verified On", asset.verifiedDate ? new Date(asset.verifiedDate).toLocaleString() : "—"]
    ];

    let fieldsHtml = fields.map(function(f){
        return `
            <div style="padding:8px 0;border-bottom:1px solid var(--color-line);display:flex;justify-content:space-between;gap:12px;">
                <span style="color:var(--color-muted);font-size:13px;">${f[0]}</span>
                <span style="font-weight:600;font-size:13.5px;text-align:right;">${f[1] || "—"}</span>
            </div>
        `;
    }).join("");

    let historyHtml = "";

    if(history.length === 0){
        historyHtml = `<p style="color:var(--color-muted);font-size:13px;">No inspection history yet.</p>`;
    } else {
        historyHtml = history.map(function(h){
            return `
                <div style="padding:10px 0;border-bottom:1px solid var(--color-line);">
                    <div style="font-size:13px;font-weight:600;">${new Date(h.date).toLocaleString()} — ${h.condition}</div>
                    <div style="font-size:12.5px;color:var(--color-muted);">By ${h.inspectedBy}${h.notes ? " · " + h.notes : ""}</div>
                </div>
            `;
        }).join("");
    }

    document.getElementById("detailModalTitle").textContent = asset.assetName + " (" + asset.assetID + ")";
    document.getElementById("detailModalPhoto").src = asset.photo || "../images/no-image.png";
    document.getElementById("detailFields").innerHTML = fieldsHtml;
    document.getElementById("detailHistory").innerHTML = historyHtml;

    document.getElementById("detailModal").classList.add("open");

}

function closeDetailModal(){
    document.getElementById("detailModal").classList.remove("open");
}

// -----------------------------
// Filter Setup
// -----------------------------
function populateDeptFilter(){

    const deptFilterEl = document.getElementById("filterDept");

    if(!deptFilterEl){
        return;
    }

    const departments = getDepartments();

    departments.forEach(function(d){
        const opt = document.createElement("option");
        opt.value = d.key;
        opt.textContent = d.name;
        deptFilterEl.appendChild(opt);
    });

}

function clearFilters(){

    const deptFilterEl = document.getElementById("filterDept");
    if(deptFilterEl){
        deptFilterEl.value = "";
    }

    document.getElementById("block").value = "";
    document.getElementById("section").innerHTML = '<option value="">All Sections</option>';
    document.getElementById("location").innerHTML = '<option value="">All Locations</option>';
    document.getElementById("subLocation").innerHTML = '<option value="">All Sub Locations</option>';

    loadAssets();

}

if(isGlobalScope){
    populateDeptFilter();
}

["filterDept", "block", "section", "location", "subLocation"].forEach(function(id){

    const el = document.getElementById(id);

    if(el){
        el.addEventListener("change", function(){ loadAssets(); });
    }

});

loadAssets();
