// ==========================================
// Hospital Asset Management System
// Asset Utilization (cross-department breakdown)
// ==========================================

// This tool is always global - a management overview across every department.

function renderBarGroup(containerID, entries, totalCount, colorVar){

    const container = document.getElementById(containerID);
    container.innerHTML = "";

    if(entries.length === 0){
        container.innerHTML = `<p style="color:var(--color-muted);font-size:13px;">No data yet.</p>`;
        return;
    }

    entries.forEach(function([label, count]){

        const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

        container.innerHTML += `
            <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;">
                    <span style="font-weight:600;">${label}</span>
                    <span style="color:var(--color-muted);">${count} (${pct}%)</span>
                </div>
                <div style="background:var(--color-bg);border-radius:6px;height:10px;overflow:hidden;">
                    <div style="background:${colorVar};height:100%;width:${pct}%;border-radius:6px;"></div>
                </div>
            </div>
        `;

    });

}

function loadUtilization(){

    const allAssets = JSON.parse(localStorage.getItem("Assets")) || [];

    const total = allAssets.length;

    document.getElementById("statTotal").textContent = total;

    const assigned = allAssets.filter(a => (a.usedBy || "").trim() !== "").length;
    const unassigned = total - assigned;

    document.getElementById("statAssigned").textContent = assigned;
    document.getElementById("statUnassigned").textContent = unassigned;

    const activeDepts = new Set(allAssets.map(a => a.departmentKey).filter(Boolean));
    document.getElementById("statActiveDepts").textContent = activeDepts.size;

    if(total === 0){

        document.getElementById("byDepartment").innerHTML = `<p style="color:var(--color-muted);font-size:13px;">No assets registered yet.</p>`;
        document.getElementById("byCategory").innerHTML = `<p style="color:var(--color-muted);font-size:13px;">No assets registered yet.</p>`;
        document.getElementById("byStatus").innerHTML = `<p style="color:var(--color-muted);font-size:13px;">No assets registered yet.</p>`;

        return;

    }

    // -----------------------------
    // By Department
    // -----------------------------
    const deptCounts = {};

    allAssets.forEach(function(a){
        const deptName = getDepartment(a.departmentKey).name;
        deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
    });

    const deptEntries = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);

    renderBarGroup("byDepartment", deptEntries, total, "var(--color-primary)");

    // -----------------------------
    // By Category
    // -----------------------------
    const categoryCounts = {};

    allAssets.forEach(function(a){
        const cat = (a.category || "").trim() || "Uncategorized";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryEntries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

    renderBarGroup("byCategory", categoryEntries, total, "var(--color-accent)");

    // -----------------------------
    // By Status
    // -----------------------------
    const statusCounts = { "Working": 0, "Under Repair": 0, "Condemned": 0 };

    allAssets.forEach(function(a){
        const status = a.status || "Working";
        if(statusCounts[status] === undefined){
            statusCounts[status] = 0;
        }
        statusCounts[status]++;
    });

    const statusColors = {
        "Working": "var(--status-working)",
        "Under Repair": "var(--status-repair)",
        "Condemned": "var(--status-condemned)"
    };

    const statusContainer = document.getElementById("byStatus");
    statusContainer.innerHTML = "";

    Object.entries(statusCounts).forEach(function([label, count]){

        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const color = statusColors[label] || "var(--color-muted)";

        statusContainer.innerHTML += `
            <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;">
                    <span style="font-weight:600;">${label}</span>
                    <span style="color:var(--color-muted);">${count} (${pct}%)</span>
                </div>
                <div style="background:var(--color-bg);border-radius:6px;height:10px;overflow:hidden;">
                    <div style="background:${color};height:100%;width:${pct}%;border-radius:6px;"></div>
                </div>
            </div>
        `;

    });

}

loadUtilization();
