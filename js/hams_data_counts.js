
// HAMS live data counters - never trust stale cached asset counts.
function hamsAssets(){
    try { return JSON.parse(localStorage.getItem("Assets") || "[]"); }
    catch(e) { return []; }
}
function hamsInspections(){
    try { return JSON.parse(localStorage.getItem("Inspections") || "[]"); }
    catch(e) { return []; }
}
function hamsDuties(){
    try { return JSON.parse(localStorage.getItem("HAMS_Duties") || "[]"); }
    catch(e) { return []; }
}
function hamsLiveAssetCount(){
    return hamsAssets().length;
}
function hamsClearStaleAssetCounts(){
    ["assetCount","AssetCount","totalAssets","TotalAssets","assetsCount","AssetsCount"].forEach(k=>{
        localStorage.removeItem(k);
    });
}
