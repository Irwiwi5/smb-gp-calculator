/* ===========================================================
   Your Wireless — SMB GP Calculator (PWA)
   =========================================================== */

/* ---------------------------------------------------------
   DEFAULT CATALOG — used only on the very first launch,
   before the app has ever fetched catalog.json (e.g. first
   run with no internet). "key" ties each row to the matching
   row in catalog.json so later updates can find and refresh
   it without duplicating or disturbing anyone's custom items.
   type: "line" = paid per unit (qty multiplies)
         "account" = flat payout regardless of qty (qty normally 1)
--------------------------------------------------------- */
const DEFAULT_CATALOG = [
  { key:"tech-team-tmp-md-25-49", name:"Tech Team + TMP MD Bundle — 25–49 lines", category:"Device Protection / Tech Support", payout:1257, type:"account", notes:"One enrollment, whole account" },
  { key:"tmp-md-biz-25-49", name:"TMP MD for Business — 25–49 lines", category:"Device Protection / Tech Support", payout:897, type:"account", notes:"Confirm per-line vs flat scaling" },
  { key:"tech-team-tmp-md-11-24", name:"Tech Team + TMP MD Bundle — 11–24 lines", category:"Device Protection / Tech Support", payout:667, type:"account", notes:"One enrollment, whole account" },
  { key:"tmp-md-biz-11-24", name:"TMP MD for Business — 11–24 lines", category:"Device Protection / Tech Support", payout:447, type:"account", notes:"Confirm per-line vs flat scaling" },
  { key:"ip-newacct-270", name:"VZW iPhone — New Account Activation", category:"Equipment Activation / Upgrade", payout:270, type:"line", notes:"Exhibit B Chart 4: $130 activation + $140 new-account incentive" },
  { key:"sp-newacct-270", name:"Smartphone (Android) — New Account Activation", category:"Equipment Activation / Upgrade", payout:270, type:"line", notes:"Exhibit B Chart 4: $130 activation + $140 new-account incentive; excludes iPhone" },
  { key:"ip-addaline-220", name:"VZW iPhone — Add-A-Line Activation", category:"Equipment Activation / Upgrade", payout:220, type:"line", notes:"Exhibit B Chart 4: $130 activation + $90 add-a-line incentive" },
  { key:"sp-addaline-220", name:"Smartphone (Android) — Add-A-Line Activation", category:"Equipment Activation / Upgrade", payout:220, type:"line", notes:"Exhibit B Chart 4: $130 activation + $90 add-a-line incentive; excludes iPhone" },
  { key:"bi-fwa-400mbps", name:"5G Business Internet — 400 Mbps (FWA)", category:"Business Internet (FWA)", payout:380, type:"line", notes:"Per device installed" },
  { key:"tech-team-biz-25-49", name:"Tech Team for Business — 25–49 lines", category:"Device Protection / Tech Support", payout:360, type:"account", notes:"Flat, per account" },
  { key:"bi-fwa-200-500-1g", name:"Business Internet FWA — 200/500 Mbps / 1 Gbps", category:"Business Internet (FWA)", payout:355, type:"line", notes:"Per device installed" },
  { key:"tech-team-tmp-md-3-10", name:"Tech Team + TMP MD Bundle — 3–10 lines", category:"Device Protection / Tech Support", payout:227, type:"account", notes:"Flat, per account" },
  { key:"tech-team-biz-11-24", name:"Tech Team for Business — 11–24 lines", category:"Device Protection / Tech Support", payout:220, type:"account", notes:"Flat, per account" },
  { key:"bi-fwa-100-300-10", name:"Business Internet FWA — 100/300 Mbps / 10 Mbps", category:"Business Internet (FWA)", payout:305, type:"line", notes:"Per device installed" },
  { key:"onetalk-desk-select-lte", name:"One Talk (Select LTE) Desk Phone", category:"One Talk", payout:170, type:"line", notes:"SMB \"BE\" accounts only" },
  { key:"biz-complete-preferred", name:"Verizon Business Complete Unlimited — Preferred Plan", category:"Price Plan", payout:150, type:"line", notes:"New line + device rental only, SMB (BE). No separate upgrade commission." },
  { key:"biz-complete-standard", name:"Verizon Business Complete Unlimited — Standard Plan", category:"Price Plan", payout:150, type:"line", notes:"New line + device rental only, SMB (BE). No separate upgrade commission." },
  { key:"tech-team-biz-3-10", name:"Tech Team for Business — 3–10 lines", category:"Device Protection / Tech Support", payout:162, type:"account", notes:"Flat, per account" },
  { key:"masters-onetalk-16-75", name:"Masters Telecom One Talk Support — 16–75 users", category:"One Talk", payout:125, type:"account", notes:"Per account" },
  { key:"ip-upgrade-130", name:"VZW iPhone — Upgrade", category:"Equipment Activation / Upgrade", payout:130, type:"line", notes:"Exhibit B Chart 4 upgrade commission, SMB" },
  { key:"sp-upgrade-130", name:"Smartphone (Android) — Upgrade", category:"Equipment Activation / Upgrade", payout:130, type:"line", notes:"Exhibit B Chart 4 upgrade commission, SMB; excludes iPhone" },
  { key:"masters-onetalk-1-15", name:"Masters Telecom One Talk Support — 1–15 users", category:"One Talk", payout:75, type:"account", notes:"Per account" },
  { key:"kicker-line-spiff-6plus", name:"Sales Kicker — Line SPIFF, 6+ lines (per line)", category:"Sales Kickers (Internal SPIFF)", payout:30, type:"line", notes:"Retroactive ladder — confirm current terms with your director; separate from Verizon Exhibit B GP" },
  { key:"bp-newacct-70", name:"Basic Phone — New Account Activation", category:"Equipment Activation / Upgrade", payout:70, type:"line", notes:"Exhibit B Chart 4: $50 activation + $20 new-account incentive" },
  { key:"bp-addaline-70", name:"Basic Phone — Add-A-Line Activation", category:"Equipment Activation / Upgrade", payout:70, type:"line", notes:"Exhibit B Chart 4: $50 activation + $20 add-a-line incentive" },
  { key:"biz-internet-security-preferred", name:"Verizon Business Internet Security — Preferred", category:"Optional Feature", payout:65, type:"line", notes:"Per line" },
  { key:"tmp-biz-tech-coach-standalone", name:"TMP for Business / Tech Coach (standalone)", category:"Device Protection / Tech Support", payout:65, type:"line", notes:"Per line / enrollment" },
  { key:"biz-unltd-plus", name:"Business Unlimited Plus — Price Plan", category:"Price Plan", payout:60, type:"line", notes:"Per line, on activation. $25 on upgrade — add that separately if needed." },
  { key:"biz-unltd-pro", name:"Business Unlimited Pro — Price Plan", category:"Price Plan", payout:60, type:"line", notes:"Per line, on activation. $25 on upgrade — add that separately if needed." },
  { key:"ipad-activation-90", name:"VZW iPad — Activation", category:"Equipment Activation / Upgrade", payout:90, type:"line", notes:"Exhibit B Chart 4" },
  { key:"protect-home-fwa-whole-office", name:"Verizon Protect Home (FWA) / Whole Office Mgmt", category:"Optional Feature", payout:100, type:"line", notes:"Per line" },
  { key:"biz-internet-security-plus", name:"Verizon Business Internet Security — Plus", category:"Optional Feature", payout:40, type:"line", notes:"Per line" },
  { key:"kicker-line-spiff-3-5", name:"Sales Kicker — Line SPIFF, 3–5 lines (per line)", category:"Sales Kickers (Internal SPIFF)", payout:20, type:"line", notes:"Retroactive ladder — confirm current terms with your director; separate from Verizon Exhibit B GP" },
  { key:"second-number-price-plan", name:"Second Number — Price Plan Commission", category:"Price Plan", payout:50, type:"line", notes:"Regular 2nd Number only" },
  { key:"tablet-activation-90", name:"Tablet (excl. iPad) — Activation", category:"Equipment Activation / Upgrade", payout:90, type:"line", notes:"Exhibit B Chart 4" },
  { key:"onetalk-auto-receptionist", name:"One Talk Auto Receptionist", category:"Optional Feature", payout:30, type:"line", notes:"Per line" },
  { key:"ipad-upgrade-80", name:"VZW iPad — Upgrade", category:"Equipment Activation / Upgrade", payout:80, type:"line", notes:"Exhibit B Chart 4" },
  { key:"tablet-upgrade-80", name:"Tablet (excl. iPad) — Upgrade", category:"Equipment Activation / Upgrade", payout:80, type:"line", notes:"Exhibit B Chart 4" },
  { key:"hotspot-act-or-upgrade-100", name:"4G/5G Hotspot / USB Modem / Netbook — Activation or Upgrade", category:"Equipment Activation / Upgrade", payout:100, type:"line", notes:"Exhibit B Chart 4 — same rate both ways" },
  { key:"kicker-line-spiff-1-2", name:"Sales Kicker — Line SPIFF, 1–2 lines (per line)", category:"Sales Kickers (Internal SPIFF)", payout:10, type:"line", notes:"Retroactive ladder — confirm current terms with your director; separate from Verizon Exhibit B GP" },
  { key:"kicker-lead-spiff", name:"Sales Kicker — Qualifying Corporate Lead SPIFF", category:"Sales Kickers (Internal SPIFF)", payout:5, type:"line", notes:"Paid once per qualifying lead — confirm current terms with your director" },
  { key:"biz-mobile-internet-security-addon", name:"Business Mobile Internet Security (add-on)", category:"Optional Feature", payout:8, type:"line", notes:"Per line" },
  { key:"whole-office-protection", name:"Whole Office Protection", category:"Optional Feature", payout:100, type:"line", notes:"Per line" },
  { key:"smb-fwa-priority-help-desk", name:"SMB FWA Priority Help Desk (4G/5G)", category:"Optional Feature", payout:5, type:"line", notes:"Per line" },
];

const LS_CATALOG = "ywGpCalc_catalog_v1";
const LS_DEAL = "ywGpCalc_deal_v1";
const LS_CATALOG_VERSION = "ywGpCalc_catalogVersion_v1";
const LS_DEAL_LOG = "ywGpCalc_dealLog_v1";
const CATALOG_URL = "./catalog.json";

let catalog = [];
let deal = []; // { id, name, category, payout, type, qty }
let nextDealId = 1;
let dealLog = []; // { id, date, accountName, repName, itemCount, totalGP, items:[{name,category,payout,qty,subtotal}] }

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
function loadDealLog(){
  const raw = localStorage.getItem(LS_DEAL_LOG);
  if (raw){
    try { dealLog = JSON.parse(raw); return; } catch(e){}
  }
  dealLog = [];
}
function saveDealLog(){
  localStorage.setItem(LS_DEAL_LOG, JSON.stringify(dealLog));
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
  deal.forEach(d => { if (d.catalogId === id){ d.name = item.name; d.payout = item.payout; d.type = item.type; d.category = item.category; } });
  saveDeal();
  populateCategorySelect();
  renderDeal();
  renderQuickAdd();
  renderSuggestions();
}
function addBlankCatalogRow(){
  // no "key" — this is a rep's own custom item, so a future catalog.json update will never touch or remove it
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
  localStorage.removeItem(LS_CATALOG_VERSION);
  saveCatalog();
  renderCatalogEditor();
  populateCategorySelect();
  renderQuickAdd();
  renderSuggestions();
  checkForUpdates(true);
}

/* ---------------- EXPORT / IMPORT CATALOG (manual / offline sharing) ---------------- */
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
      const items = Array.isArray(parsed) ? parsed : parsed.items;
      if (!Array.isArray(items)) throw new Error("not an array");
      catalog = items.map(it => ({
        id: it.id || uid(),
        key: it.key || undefined,
        name: it.name || "Unnamed item",
        category: it.category || "Uncategorized",
        payout: typeof it.payout === "number" ? it.payout : parseFloat(it.payout) || 0,
        type: it.type === "account" ? "account" : "line",
        notes: it.notes || ""
      }));
      if (parsed && parsed.version) localStorage.setItem(LS_CATALOG_VERSION, parsed.version);
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

/* ---------------- REMOTE CATALOG UPDATES (the "future-proofing" layer) ----------------
   catalog.json lives next to this app on whatever you host it from (e.g. GitHub Pages).
   Edit that one file + publish, and every phone picks up the change next time it's online —
   no new app build, no re-sending files. Matching is by "key", so any item a rep added
   locally (no key) is never touched, and any item that's still identical is left alone. */
function mergeRemoteCatalog(remoteItems, removedKeys){
  let added = 0, updated = 0, removed = 0;
  remoteItems.forEach(r => {
    const local = catalog.find(c => c.key === r.key);
    if (local){
      if (local.name !== r.name || local.category !== r.category || local.payout !== r.payout || local.type !== r.type || local.notes !== r.notes){
        local.name = r.name; local.category = r.category; local.payout = r.payout; local.type = r.type; local.notes = r.notes;
        updated++;
      }
    } else {
      catalog.push({ id: uid(), key: r.key, name: r.name, category: r.category, payout: r.payout, type: r.type, notes: r.notes || "" });
      added++;
    }
  });
  if (Array.isArray(removedKeys) && removedKeys.length){
    const before = catalog.length;
    catalog = catalog.filter(c => !(c.key && removedKeys.includes(c.key)));
    removed = before - catalog.length;
  }
  if (added || updated || removed) saveCatalog();
  return { added, updated, removed };
}

function setOfflinePill(offline){
  const pill = document.getElementById("offlinePill");
  if (!pill) return;
  pill.classList.toggle("show", offline);
}

function checkForUpdates(silent){
  if (!navigator.onLine){
    setOfflinePill(true);
    if (!silent) alert("You're offline right now — reconnect and try again to check for a new price list.");
    return;
  }
  fetch(CATALOG_URL, { cache: "no-store" })
    .then(res => { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
    .then(data => {
      setOfflinePill(false);
      const localVersion = localStorage.getItem(LS_CATALOG_VERSION);
      if (!data || !Array.isArray(data.items)) throw new Error("bad catalog.json shape");
      if (data.version === localVersion){
        if (!silent) showToast("You're already on the latest price list (v" + data.version + ").");
        return;
      }
      const { added, updated, removed } = mergeRemoteCatalog(data.items, data.removed);
      localStorage.setItem(LS_CATALOG_VERSION, data.version);
      populateCategorySelect();
      renderQuickAdd();
      renderDeal();
      renderSuggestions();
      if (adminOpen) renderCatalogEditor();
      updateVersionTag();
      if (added || updated || removed || !localVersion){
        showToast(`Price list updated to v${data.version} (${added} new, ${updated} re-priced, ${removed} retired).`);
      } else if (!silent){
        showToast("Price list is current (v" + data.version + ").");
      }
    })
    .catch(err => {
      setOfflinePill(!navigator.onLine);
      if (!silent) console.warn("Catalog update check failed:", err);
    });
}

function showToast(msg){
  const banner = document.getElementById("updateBanner");
  document.getElementById("updateBannerMsg").textContent = msg;
  banner.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => banner.classList.remove("show"), 6000);
}
function dismissUpdateBanner(){
  document.getElementById("updateBanner").classList.remove("show");
}
function updateVersionTag(){
  const v = localStorage.getItem(LS_CATALOG_VERSION) || "local default";
  const tag = document.getElementById("versionTag");
  if (tag) tag.textContent = "Price list version: " + v;
}

/* ---------------- GP SALES TRACKER (deal log) ----------------
   Separate from the Current Deal builder above: this is a running log of
   every deal a rep has finished and chosen to save, so they can download
   one file that totals up everything they've closed — independent of
   whatever's currently in the builder. Saving a deal here does NOT clear
   the Current Deal. */
function saveDealToLog(){
  if (deal.length === 0){ alert("Add items to the deal before saving it to your log."); return; }
  const accountName = (prompt("Account / customer name for this deal (optional):", "") || "").trim();
  const total = deal.reduce((s,d) => s + d.payout*d.qty, 0);
  const entry = {
    id: uid(),
    date: new Date().toISOString().slice(0,10),
    accountName: accountName || "(unnamed account)",
    itemCount: deal.length,
    totalGP: total,
    items: deal.map(d => ({ name:d.name, category:d.category, payout:d.payout, qty:d.qty, subtotal: d.payout*d.qty }))
  };
  dealLog.push(entry);
  saveDealLog();
  renderDealLog();
  showToast(`Saved "${entry.accountName}" — $${formatMoney(total)} — to your GP log.`);
}
function renderDealLog(){
  const body = document.getElementById("dealLogBody");
  const section = document.getElementById("dealLogSection");
  if (!body || !section) return;
  if (dealLog.length === 0){
    section.classList.remove("has-entries");
    body.innerHTML = `<tr><td colspan="5" class="empty-state">No saved deals yet. Build a deal above, then tap "Save This Deal to Log."</td></tr>`;
  } else {
    section.classList.add("has-entries");
    body.innerHTML = dealLog.slice().reverse().map(e => `
      <tr>
        <td>${escapeHtml(e.date)}</td>
        <td>${escapeHtml(e.accountName)}</td>
        <td class="center">${e.itemCount}</td>
        <td class="num">$${formatMoney(e.totalGP)}</td>
        <td class="center"><button class="row-remove" onclick="deleteLogEntry('${e.id}')" title="Remove">✕</button></td>
      </tr>`).join("");
  }
  const grand = dealLog.reduce((s,e) => s + e.totalGP, 0);
  const totalEl = document.getElementById("dealLogGrandTotal");
  if (totalEl) totalEl.textContent = "$" + formatMoney(grand);
  const countEl = document.getElementById("dealLogCount");
  if (countEl) countEl.textContent = dealLog.length + " saved deal" + (dealLog.length===1?"":"s");
}
function deleteLogEntry(id){
  if (!confirm("Remove this saved deal from your log? This can't be undone.")) return;
  dealLog = dealLog.filter(e => e.id !== id);
  saveDealLog();
  renderDealLog();
}
function clearDealLog(){
  if (dealLog.length === 0) return;
  if (!confirm("Clear your entire GP sales log? This removes all " + dealLog.length + " saved deals and can't be undone. Download it first if you want to keep a copy.")) return;
  dealLog = [];
  saveDealLog();
  renderDealLog();
}
function csvEscape(val){
  const s = String(val == null ? "" : val);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
}
function downloadDealLog(){
  if (dealLog.length === 0){ alert("Your GP log is empty — save a deal first."); return; }
  const rows = [];
  rows.push(["Your Wireless — SMB GP Sales Log"]);
  rows.push(["Exported", new Date().toLocaleString()]);
  rows.push([]);
  rows.push(["Date","Account / Customer","Item","Category","Rate","Qty","Line GP","Deal Total GP"]);
  dealLog.forEach(e => {
    e.items.forEach((it, idx) => {
      rows.push([
        idx===0 ? e.date : "",
        idx===0 ? e.accountName : "",
        it.name, it.category, it.payout, it.qty, it.subtotal,
        idx===0 ? e.totalGP : ""
      ]);
    });
  });
  const grand = dealLog.reduce((s,e) => s + e.totalGP, 0);
  rows.push([]);
  rows.push(["","","","","","","GRAND TOTAL — ALL SAVED DEALS", grand]);
  const csv = rows.map(r => r.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "yw-smb-gp-sales-log-" + new Date().toISOString().slice(0,10) + ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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

/* ---------------- INSTALL PROMPT (Android "Add to Home Screen") ---------------- */
let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  document.getElementById("installBanner").classList.add("show");
});
function installApp(){
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.finally(() => {
    deferredInstallPrompt = null;
    document.getElementById("installBanner").classList.remove("show");
  });
}
function dismissInstallBanner(){
  document.getElementById("installBanner").classList.remove("show");
}
window.addEventListener("appinstalled", () => {
  document.getElementById("installBanner").classList.remove("show");
});

/* ---------------- ONLINE / OFFLINE ---------------- */
window.addEventListener("online", () => { setOfflinePill(false); checkForUpdates(true); });
window.addEventListener("offline", () => setOfflinePill(true));

/* ---------------- SERVICE WORKER ---------------- */
function registerServiceWorker(){
  if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js").catch(err => {
      console.warn("Service worker registration failed:", err);
    });
  }
}

/* ---------------- INIT ---------------- */
function init(){
  loadCatalog();
  loadDeal();
  loadDealLog();
  populateCategorySelect();
  renderQuickAdd();
  renderDeal();
  renderSuggestions();
  renderDealLog();
  updateVersionTag();
  setOfflinePill(!navigator.onLine);
  registerServiceWorker();
  // small delay so the UI paints first, then quietly check for a newer price list
  setTimeout(() => checkForUpdates(true), 600);
}
init();
