
/* HAMS Final Core - shared helpers */
function hamsGetAssets(){ try{return JSON.parse(localStorage.getItem("Assets")||"[]")}catch(e){return[]} }
function hamsGetInspections(){ try{return JSON.parse(localStorage.getItem("Inspections")||"[]")}catch(e){return[]} }
function hamsGetDuties(){ try{return JSON.parse(localStorage.getItem("HAMS_Duties")||"[]")}catch(e){return[]} }
function hamsGetIssues(){ try{return JSON.parse(localStorage.getItem("HAMS_Issues")||"[]")}catch(e){return[]} }
function hamsSaveIssues(v){localStorage.setItem("HAMS_Issues",JSON.stringify(v))}
function hamsAudit(action,entityType,entityID,details){
 const a=JSON.parse(localStorage.getItem("HAMS_AuditLog")||"[]");
 a.unshift({auditID:"AUD-"+Date.now()+"-"+Math.random().toString(36).slice(2,6),timestamp:new Date().toISOString(),
 user:localStorage.getItem("Employee")||"Unknown",employeeID:localStorage.getItem("EmployeeID")||"",
 role:localStorage.getItem("Role")||"",action,entityType,entityID,details:details||""});
 localStorage.setItem("HAMS_AuditLog",JSON.stringify(a));
}
function hamsAsset(id){return hamsGetAssets().find(a=>a.assetID===id)||null}
function hamsAssetIndex(id){return hamsGetAssets().findIndex(a=>a.assetID===id)}
function hamsInspectionsFor(id){return hamsGetInspections().filter(x=>x.assetID===id).sort((a,b)=>new Date(b.date)-new Date(a.date))}
function hamsLatestInspection(id){return hamsInspectionsFor(id)[0]||null}
function hamsOpenAsset360(id){ if(hamsAsset(id)){location.href="asset_360.html?assetID="+encodeURIComponent(id)} }
function hamsRoleAllowed(roles){
 const role=(localStorage.getItem("Role")||"").toLowerCase();
 if(!roles || !roles.length)return true;
 return roles.map(x=>x.toLowerCase()).includes(role);
}
function hamsRequireRole(roles){
 if(!hamsRoleAllowed(roles)){alert("You do not have permission to access this section.");history.back();return false}
 return true;
}
function hamsAssetCount(){return hamsGetAssets().length}
function hamsInspectionCount(){
 const ids=new Set(hamsGetAssets().map(a=>a.assetID));
 return hamsGetInspections().filter(i=>ids.has(i.assetID)).length
}
function hamsIssueCount(){return hamsGetIssues().filter(i=>i.status!=="Closed").length}
