/* ---------------------------------------------------------
   DEFAULT CATALOG
   type: "line" = paid per unit (qty multiplies)
         "account" = flat payout regardless of qty (qty normally 1)
--------------------------------------------------------- */
const DEFAULT_CATALOG = [
  { name:"Tech Team + TMP MD Bundle — 25–49 lines", category:"Device Protection / Tech Support", payout:1257, type:"account", notes:"One enrollment, whole account" },
  { name:"TMP MD for Business — 25–49 lines", category:"Device Protection / Tech Support", payout:897, type:"account", notes:"Confirm per-line vs flat scaling" },
  { name:"Tech Team + TMP MD Bundle — 11–24 lines", category:"Device Protection / Tech Support", payout:667, type:"account", notes:"One enrollment, whole account" },
  { name:"TMP MD for Business — 11–24 lines", category:"Device Protection / Tech Support", payout:447, type:"account", notes:"Confirm per-line vs flat scaling" },
  { name:"5G Business Internet — 400 Mbps (FWA)", category:"Business Internet (FWA)", payout:380, type:"line", notes:"Per device installed" },
  { name:"Tech Team for Business — 25–49 lines", category:"Device Protection / Tech Support", payout:360, type:"account", notes:"Flat, per account" },
  { name:"Business Internet FWA — 200/500 Mbps / 1 Gbps", category:"Business Internet (FWA)", payout:355, type:"line", notes:"Per device installed" },
  { name:"Tech Team + TMP MD Bundle — 3–10 lines", category:"Device Protection / Tech Support", payout:227, type:"account", notes:"Flat, per account" },
  { name:"Tech Team for Business — 11–24 lines", category:"Device Protection / Tech Support", payout:220, type:"account", notes:"Flat, per account" },
  { name:"Business Internet FWA — 100/300 Mbps / 10 Mbps", category:"Business Internet (FWA)", payout:305, type:"line", notes:"Per device installed" },
  { name:"One Talk (Select LTE) Desk Phone", category:"One Talk", payout:170, type:"line", notes:"SMB \"BE\" accounts only" },
  { name:"Verizon Business Complete Unlimited (Preferred/Standard)", category:"Price Plan", payout:150, type:"line", notes:"New line + device rental only" },
  { name:"Tech Team for Business — 3–10 lines", category:"Device Protection / Tech Support", payout:162, type:"account", notes:"Flat, per account" },
  { name:"Masters Telecom One Talk Support — 16–75 users", category:"One Talk", payout:125, type:"account", notes:"Per account" },
  { name:"Smartphone / iPhone Activation (Installment, SMB New Account)", category:"Equipment Activation", payout:140, type:"line", notes:"Per line" },
  { name:"Masters Telecom One Talk Support — 1–15 users", category:"One Talk", payout:75, type:"account", notes:"Per account" },
  { name:"Verizon Business Internet Security — Preferred", category:"Optional Feature", payout:65, type:"line", notes:"Per line" },
  { name:"TMP for Business / Tech Coach (standalone)", category:"Device Protection / Tech Support", payout:65, type:"line", notes:"Per line / enrollment" },
  { name:"Business Unlimited Plus / Pro — Price Plan", category:"Price Plan", payout:60, type:"line", notes:"Per line, on activation" },
  { name:"Verizon Protect Home (FWA) / Whole Office Mgmt", category:"Optional Feature", payout:100, type:"line", notes:"Per line" },
  { name:"Verizon Business Internet Security — Plus", category:"Optional Feature", payout:40, type:"line", notes:"Per line" },
  { name:"Second Number — Price Plan Commission", category:"Price Plan", payout:50, type:"line", notes:"Regular 2nd Number only" },
  { name:"One Talk Auto Receptionist", category:"Optional Feature", payout:30, type:"line", notes:"Per line" },
  { name:"VZW Tablet Activation (SMB New Account)", category:"Equipment Activation", payout:40, type:"line", notes:"Per line" },
  { name:"4G/5G Mobile Hotspot Activation (SMB)", category:"Equipment Activation", payout:60, type:"line", notes:"Per line" },
  { name:"Business Mobile Internet Security (add-on)", category:"Optional Feature", payout:8, type:"line", notes:"Per line" },
  { name:"Whole Office Protection", category:"Optional Feature", payout:100, type:"line", notes:"Per line" },
  { name:"SMB FWA Priority Help Desk (4G/5G)", category:"Optional Feature", payout:5, type:"line", notes:"Per line" },
];

const LS_CATALOG = "ywGpCalc_catalog_v1";
const LS_DEAL = "ywGpCalc_deal_v1";
const LS_ADMIN_SEEN = "ywGpCalc_adminSeen_v1";

let catalog = [];
let deal = []; // { id, name, category, payout, type, qty }
let nextDealId = 1;

function uid(){ return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function loadCatalog(){
  const raw = localStorage.getItem(LS_CATALOG);
  if (raw){
    try { catalog = JSON.parse(raw); return; } catch(e){ /* fall through */ }
  }
  catalog = DEFAULT_CATALOG.map(it => ({ id: uid(), ...it }));
  saveCatalog();
}
function saveCatalog(){
  localStorage.setItem(LS_CATALOG, JSON.stringify(catalog));
}
function loadDeal(){
  const raw = localStorage.getItem(LS_DEAL);
  if (raw){
    try { deal = JSON.parse(raw); nextDealId = (deal.reduce((m,d)=>Math.max(m, d.id||0), 0)) + 1; return; } catch(e){}
  }
  deal = [];
}
function saveDeal(){
  localStorage.setItem(LS_DEAL, JSON.stringify(deal));
}

/* ---------------- CATEGORY / ITEM SELECTS ---------------- */
function getCategories(){
  const set = new Set(catalog.map(c => c.category || "Uncategorized"));
  return Array.from(set).sort();
}
function populateCategorySelect(){
  const sel = document.getElementById("categorySelect");
  const cats = getCategories();
  sel.innerHTML = `<option value="__all__">All Categories</option>` +
    cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  populateItemSelect();
}
function populateItemSelect(){
  const catSel = document.getElementById("categorySelect").value;
  const items = catalog
    .filter(c => catSel === "__all__" || c.category === catSel)
    .slice()
    .sort((a,b) => b.payout - a.payout);
  const itemSel = document.getElementById("itemSelect");
  if (items.length === 0){
    itemSel.innerHTML = `<option value="">No items in this category</option>`;
    return;
  }
  itemSel.innerHTML = items.map(it =>
    `<option value="${it.id}">${escapeHtml(it.name)} — $${formatMoney(it.payout)}${it.type==="account" ? " (account)" : ""}</option>`
  ).join("");
}

function addSelectedToDeal(){
  const itemSel = document.getElementById("itemSelect");
  const id = itemSel.value;
  if (!id) return;
  const qty = Math.max(1, parseInt(document.getElementById("qtyInput").value, 10) || 1);
  addCatalogItemToDeal(id, qty);
}
function addCatalogItemToDeal(catalogId, qty){
  const item = catalog.find(c => c.id === catalogId);
  if (!item) return;
  // if already on the deal, bump qty instead of duplicating
  const existing = deal.find(d => d.catalogId === catalogId);
  if (existing){
    existing.qty += qty;
  } else {
    deal.push({
      id: nextDealId++,
      catalogId: item.id,
      name: item.name,
      category: item.category,
      payout: item.payout,
      type: item.type,
      qty: qty
    });
  }
  saveDeal();
  renderDeal();
  renderSuggestions();
}

/* ---------------- QUICK ADD CHIPS ---------------- */
function renderQuickAdd(){
  const top = catalog.slice().sort((a,b) => b.payout - a.payout).slice(0, 6);
  const wrap = document.getElementById("quickAddChips");
  wrap.innerHTML = top.map(it =>
    `<div class="chip" onclick="addCatalogItemToDeal('${it.id}',1)">+ ${escapeHtml(it.name)} <span class="amt">$${formatMoney(it.payout)}</span></div>`
  ).join("");
}

/* ---------------- DEAL TABLE ---------------- */
function renderDeal(){
  const body = document.getElementById("dealBody");
  const sub = document.getElementById("dealSub");
  if (deal.length === 0){
    body.innerHTML = `<tr><td colspan="6" class="empty-state">No items yet. Add a product or service above, or tap a quick-add chip.</td></tr>`;
    sub.textContent = "Nothing added yet — pick items above.";
  } else {
    sub.textContent = `${deal.length} line item${deal.length>1?"s":""} on this deal.`;
    body.innerHTML = deal.map(d => {
      const subtotal = d.payout * d.qty;
      return `<tr>
        <td>${escapeHtml(d.name)}</td>
        <td>${escapeHtml(d.category)}<span class="tag">${d.type==="account"?"Account":"Line"}</span></td>
        <td class="num">$${formatMoney(d.payout)}</td>
        <td class="center">
          <div class="qty-stepper">
            <button onclick="stepQty(${d.id}, -1)">−</button>
            <input type="number" min="1" value="${d.qty}" onchange="setQty(${d.id}, this.value)">
            <button onclick="stepQty(${d.id}, 1)">+</button>
          </div>
        </td>
        <td class="num">$${formatMoney(subtotal)}</td>
        <td class="center"><button class="row-remove" onclick="removeDealRow(${d.id})" title="Remove">✕</button></td>
      </tr>`;
    }).join("");
  }
  const total = deal.reduce((sum, d) => sum + d.payout * d.qty, 0);
  document.getElementById("grandTotal").textContent = "$" + formatMoney(total);
  document.getElementById("itemCountLabel").textContent = `${deal.length} line item${deal.length===1?"":"s"}`;

  const foot = document.getElementById("dealFoot");
  if (deal.length === 0){
    foot.style.display = "none";
  } else {
    foot.style.display = "table-footer-group";
    document.getElementById("dealFootTotal").textContent = "$" + formatMoney(total);
  }
}
function stepQty(id, delta){
  const row = deal.find(d => d.id === id);
  if (!row) return;
  row.qty = Math.max(1, row.qty + delta);
  saveDeal(); renderDeal();
}
function setQty(id, val){
  const row = deal.find(d => d.id === id);
  if (!row) return;
  row.qty = Math.max(1, parseInt(val,10) || 1);
  saveDeal(); renderDeal();
}
function removeDealRow(id){
  deal = deal.filter(d => d.id !== id);
  saveDeal(); renderDeal(); renderSuggestions();
}
function clearDeal(){
  if (deal.length && !confirm("Start a new deal? This clears the current list.")) return;
  deal = [];
  saveDeal(); renderDeal(); renderSuggestions();
}

/* ---------------- SUGGESTIONS ---------------- */
function renderSuggestions(){
  const usedIds = new Set(deal.map(d => d.catalogId));
  const suggestions = catalog
    .filter(c => !usedIds.has(c.id))
    .sort((a,b) => b.payout - a.payout)
    .slice(0, 4);
  const box = document.getElementById("suggestBox");
  if (suggestions.length === 0 || deal.length === 0){
    box.style.display = "none";
    return;
  }
  box.style.display = "block";
  document.getElementById("suggestChips").innerHTML = suggestions.map(it =>
    `<div class="chip" onclick="addCatalogItemToDeal('${it.id}',1)">+ ${escapeHtml(it.name)} <span class="amt">$${formatMoney(it.payout)}</span></div>`
  ).join("");
}

/* ---------------- ADMIN / CATALOG EDITOR ---------------- */
let adminOpen = false;
function toggleAdmin(){
  adminOpen = !adminOpen;
  document.getElementById("adminPanel").classList.toggle("open", adminOpen);
  document.getElementById("adminToggle").classList.toggle("active", adminOpen);
  document.getElementById("adminToggleLabel").textContent = "Edit Catalog: " + (adminOpen ? "On" : "Off");
  if (adminOpen) renderCatalogEditor();
}
function renderCatalogEditor(){
  const el = document.getElementById("catalogEditor");
  el.innerHTML = catalog.map(c => `
    <div class="admin-row" data-id="${c.id}">
      <input type="text" value="${escapeAttr(c.name)}" onchange="updateCatalogField('${c.id}','name',this.value)" placeholder="Product / service name">
      <input type="text" value="${escapeAttr(c.category)}" list="categoryList" onchange="updateCatalogField('${c.id}','category',this.value)" placeholder="Category">
      <input type="number" value="${c.payout}" min="0" step="0.01" onchange="updateCatalogField('${c.id}','payout',parseFloat(this.value)||0)">
      <select onchange="updateCatalogField('${c.id}','type',this.value)">
        <option value="line" ${c.type==='line'?'selected':''}>Line</option>
        <option value="account" ${c.type==='account'?'selected':''}>Account</option>
      </select>
      <input type="text" value="${escapeAttr(c.notes||'')}" onchange="updateCatalogField('${c.id}','notes',this.value)" placeholder="Notes (optional)">
      <button class="del-row-btn" onclick="deleteCatalogRow('${c.id}')" title="Delete">🗑</button>
    </div>
  `).join("") + `<datalist id="categoryList">${getCategories().map(c=>`<option value="${escapeAttr(c)}">`).join("")}</datalist>`;
}
function updateCatalogField(id, field, value){
  const item = catalog.find(c => c.id === id);
  if (!item) return;
  item[field] = value;
  saveCatalog();
  // keep any matching deal rows in sync on name/payout/type changes
  deal.forEach(d => { if (d.catalogId === id){ d.name = item.name; d.payout = item.payout; d.type = item.type; d.category = item.category; } });
  saveDeal();
  populateCategorySelect();
  renderDeal();
  renderQuickAdd();
  renderSuggestions();
}
function addBlankCatalogRow(){
  const item = { id: uid(), name:"New Product / Service", category:"Optional Feature", payout:0, type:"line", notes:"" };
  catalog.push(item);
  saveCatalog();
  renderCatalogEditor();
  populateCategorySelect();
  renderQuickAdd();
}
function deleteCatalogRow(id){
  if (!confirm("Delete this item from the catalog?")) return;
  catalog = catalog.filter(c => c.id !== id);
  saveCatalog();
  renderCatalogEditor();
  populateCategorySelect();
  renderQuickAdd();
  renderSuggestions();
}
function resetCatalogToDefault(){
  if (!confirm("Reset the entire catalog back to the default list? Your custom items and edits will be lost (the current deal is not affected).")) return;
  catalog = DEFAULT_CATALOG.map(it => ({ id: uid(), ...it }));
  saveCatalog();
  renderCatalogEditor();
  populateCategorySelect();
  renderQuickAdd();
  renderSuggestions();
}

/* ---------------- EXPORT / IMPORT CATALOG ---------------- */
function exportCatalog(){
  const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "yw-smb-gp-catalog-" + new Date().toISOString().slice(0,10) + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function importCatalog(evt){
  const file = evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) throw new Error("not an array");
      catalog = parsed.map(it => ({
        id: it.id || uid(),
        name: it.name || "Unnamed item",
        category: it.category || "Uncategorized",
        payout: typeof it.payout === "number" ? it.payout : parseFloat(it.payout) || 0,
        type: it.type === "account" ? "account" : "line",
        notes: it.notes || ""
      }));
      saveCatalog();
      renderCatalogEditor();
      populateCategorySelect();
      renderQuickAdd();
      renderSuggestions();
      alert("Catalog imported: " + catalog.length + " items loaded.");
    } catch(err){
      alert("Couldn't read that file — make sure it's a catalog .json exported from this tool.");
    }
  };
  reader.readAsText(file);
  evt.target.value = "";
}

/* ---------------- PRINT / COPY SUMMARY ---------------- */
function buildSummaryRows(){
  return deal.map(d => `<tr><td>${escapeHtml(d.name)}</td><td>${escapeHtml(d.category)}</td><td class="num">$${formatMoney(d.payout)}</td><td class="center">${d.qty}</td><td class="num">$${formatMoney(d.payout*d.qty)}</td></tr>`).join("");
}
window.addEventListener("beforeprint", () => {
  document.getElementById("printMeta").textContent = "Prepared " + new Date().toLocaleDateString() + " · Verizon Exhibit B basis · Internal use only";
  document.getElementById("printBody").innerHTML = buildSummaryRows();
  const total = deal.reduce((s,d) => s + d.payout*d.qty, 0);
  document.getElementById("printGrand").textContent = "Total GP: $" + formatMoney(total);
});
function copyDealSummary(){
  if (deal.length === 0){ alert("Add items to the deal first."); return; }
  let lines = ["Your Wireless — SMB Deal GP Summary", new Date().toLocaleDateString(), ""];
  deal.forEach(d => lines.push(`${d.name}  —  $${formatMoney(d.payout)} x ${d.qty} = $${formatMoney(d.payout*d.qty)}`));
  const total = deal.reduce((s,d) => s + d.payout*d.qty, 0);
  lines.push("", `TOTAL GP: $${formatMoney(total)}`);
  const text = lines.join("\n");
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(() => alert("Summary copied to clipboard.")).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}
function fallbackCopy(text){
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); alert("Summary copied to clipboard."); }
  catch(e){ alert("Couldn't copy automatically — select and copy manually:\n\n" + text); }
  document.body.removeChild(ta);
}

/* ---------------- HELPERS ---------------- */
function formatMoney(n){
  return (Math.round(n * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: (n % 1 !== 0) ? 2 : 0, maximumFractionDigits: 2 });
}
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function escapeAttr(str){ return escapeHtml(str); }

/* ---------------- INIT ---------------- */
function init(){
  loadCatalog();
  loadDeal();
  populateCategorySelect();
  renderQuickAdd();
  renderDeal();
  renderSuggestions();
}
init();
