const KEY = "seedling16";
const REF = { 水稻: 45, 玉米: 50, 大豆: 42 };
const db = load();
let editPlot = null;
let roi = null;
let drag = null;
let reportId = null;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    plots: [{ id: 1, name: "东一号田", place: "东村一组", area: 12.5, soil: "壤土", created: "2024-03-15" }],
    plants: [
      { id: 1, plotId: 1, crop: "水稻", variety: "南粳 9108", sow: "2026-05-18", year: 2026, area: 12.5 },
      { id: 2, plotId: 1, crop: "玉米", variety: "郑单 958", sow: "2026-06-02", year: 2026, area: 12.5 },
      { id: 3, plotId: 1, crop: "大豆", variety: "中黄 13", sow: "2026-06-10", year: 2026, area: 12.5 }
    ],
    surveys: [],
    seq: 10
  };
}
function save() { localStorage.setItem(KEY, JSON.stringify(db)); }
function nid() { db.seq += 1; return db.seq; }
function plotName(id) { const p = db.plots.find(x => x.id === Number(id)); return p ? p.name : "—"; }
function plantOf(id) { return db.plants.find(x => x.id === Number(id)); }
function cropOf(s) { const p = plantOf(s.plantId); return p ? p.crop : "水稻"; }

function adviceText(crop, cover, ref) {
  const gap = cover - ref;
  const abs = Math.abs(gap);
  const level = abs <= 8 ? "接近" : gap < 0 ? "低于" : "高于";
  const head = `${crop}实测覆盖度 ${cover.toFixed(1)}%，参考值 ${ref.toFixed(1)}%，相差 ${gap.toFixed(1)} 个百分点，判为${level}参考值。`;
  const note = "这是照片估算，不是下田数出来的苗数。动手前请到田里数苗、看叶色，并按已施底肥和当地土肥站调整。";
  if (level === "接近") return `${head} 长势接近参考值。维持现有水肥，不要突然加肥或断水。5 到 7 天后再拍同一位置复查。${note}`;
  if (crop === "水稻" && level === "低于") return `${head} 下田数苗。缺苗处 3 天内补苗。分蘖期水层大约 3 厘米。苗稀、苗黄且底肥一般时，中等肥力田分蘖肥常见每亩尿素约 2.5 到 5 公斤；叶色已经浓绿，或施肥已经偏晚，就不要再加，以免徒长。查稻蓟马、稻飞虱，具体药剂问当地植保站。5 到 7 天后再测同一位置。${note}`;
  if (crop === "水稻" && level === "高于") return `${head} 先停止追氮肥。长势过旺时排水轻搁田，不要一直深水。密植田注意纹枯病，发现病株及时问当地植保站，不要自行加大剂量。${note}`;
  if (crop === "玉米" && level === "低于") return `${head} 先补种或移栽断垄。只有苗黄、底肥不足时，3 到 4 叶期每亩根侧追尿素大约 3 到 4 公斤并覆土。底肥够、苗正常，苗期不用再追氮。5 到 7 天后再测。${note}`;
  if (crop === "玉米" && level === "高于") return `${head} 停止再追氮肥，间掉过密弱苗，防止后期倒伏。雨后及时排水。密植田注意大小斑病，防治问当地植保站。${note}`;
  if (crop === "大豆" && level === "低于") return `${head} 缺苗处补种，覆土 2 到 3 厘米。大豆能结瘤固氮，苗黄、薄地才少量用氮，种肥或追肥常见每亩尿素 3 到 5 公斤。高肥田再追氮容易徒长倒伏。${note}`;
  return `${head} 高肥田不要再追氮，间掉弱苗，注意排水和倒伏。密植田发现病斑问当地植保站。${note}`;
}
function statusOf(cover, ref) {
  const gap = cover - ref;
  if (Math.abs(gap) <= 8) return "接近参考值";
  return gap < 0 ? "低于参考值" : "高于参考值";
}

function show(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("show"));
  document.getElementById("page-" + page).classList.add("show");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  if (page === "analyze") renderAnalyze();
  if (page === "report") renderReport();
  if (page === "advice") renderAdvice();
}
document.querySelectorAll(".nav-btn").forEach(b => b.onclick = () => show(b.dataset.page));

function renderPlots() {
  const q = (document.getElementById("plot-search").value || "").trim();
  const rows = db.plots.filter(p => !q || (p.name + p.place).includes(q));
  document.getElementById("plot-count").textContent = rows.length;
  document.getElementById("plot-table").innerHTML = rows.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><div class="name-cell"><img class="thumb" src="img/thumb.jpg" alt="" />${p.name}</div></td>
      <td>📍 ${p.place}</td>
      <td>${p.area || "—"}</td>
      <td>${p.soil || "—"}</td>
      <td>${p.created}</td>
      <td>
        <button class="btn btn-line" data-edit="${p.id}">修改</button>
        <button class="btn btn-danger" data-del="${p.id}">删除</button>
      </td>
    </tr>`).join("");
  document.querySelectorAll("[data-edit]").forEach(b => b.onclick = () => {
    const p = db.plots.find(x => x.id === Number(b.dataset.edit));
    const f = document.getElementById("plot-form");
    f.name.value = p.name; f.place.value = p.place; f.area.value = p.area; f.soil.value = p.soil;
    editPlot = p.id;
  });
  document.querySelectorAll("[data-del]").forEach(b => b.onclick = () => {
    const id = Number(b.dataset.del);
    db.plots = db.plots.filter(x => x.id !== id);
    save(); renderAll();
  });
}
document.getElementById("plot-form").onsubmit = e => {
  e.preventDefault();
  const f = e.target;
  const item = { name: f.name.value.trim(), place: f.place.value.trim(), area: Number(f.area.value) || "", soil: f.soil.value.trim(), created: new Date().toISOString().slice(0, 10) };
  if (editPlot) {
    const p = db.plots.find(x => x.id === editPlot);
    Object.assign(p, item, { created: p.created });
    editPlot = null;
  } else db.plots.push({ id: nid(), ...item });
  save(); f.reset(); renderAll();
};
document.getElementById("plot-clear").onclick = () => { editPlot = null; };
document.getElementById("plot-search").oninput = renderPlots;

function fillSelects() {
  const analyzePick = document.getElementById("analyze-pick");
  const selectedSurvey = analyzePick.value;
  const opts = db.plots.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
  document.getElementById("plant-plot").innerHTML = opts;
  document.getElementById("survey-plot").innerHTML = opts;
  const plants = db.plants.map(p => `<option value="${p.id}">${plotName(p.plotId)} · ${p.crop} · ${p.variety || ""}</option>`).join("");
  document.getElementById("survey-plant").innerHTML = plants;
  analyzePick.innerHTML = db.surveys.map(s => `<option value="${s.id}">${s.date} ${plotName(s.plotId)}</option>`).join("") || "<option value=''>暂无调查</option>";
  if (selectedSurvey && db.surveys.some(s => String(s.id) === selectedSurvey)) analyzePick.value = selectedSurvey;
}
function renderPlants() {
  const q = (document.getElementById("plant-search").value || "").trim();
  const rows = db.plants.filter(p => !q || (plotName(p.plotId) + p.year + p.crop).includes(q));
  document.getElementById("plant-count").textContent = rows.length;
  document.getElementById("plant-table").innerHTML = rows.map(p => `
    <tr><td>${plotName(p.plotId)}</td><td>${p.crop}</td><td>${p.variety || "—"}</td><td>${p.sow || "—"}</td><td>${p.year || "—"}</td><td>${p.area || "—"}</td>
    <td><button class="btn btn-danger" data-pdel="${p.id}">删除</button></td></tr>`).join("");
  document.querySelectorAll("[data-pdel]").forEach(b => b.onclick = () => {
    db.plants = db.plants.filter(x => x.id !== Number(b.dataset.pdel));
    save(); renderAll();
  });
}
document.getElementById("plant-form").onsubmit = e => {
  e.preventDefault();
  const f = e.target;
  db.plants.push({ id: nid(), plotId: Number(f.plotId.value), crop: f.crop.value, variety: f.variety.value, sow: f.sow.value, year: Number(f.year.value) || new Date().getFullYear(), area: Number(f.area.value) || "" });
  save(); f.reset(); renderAll();
};
document.getElementById("plant-search").oninput = renderPlants;

function compress(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1100;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => reject(new Error("图片读取失败"));
    img.src = url;
  });
}
document.getElementById("survey-form").onsubmit = async e => {
  e.preventDefault();
  const msg = document.getElementById("survey-msg");
  msg.textContent = "正在保存…";
  const f = e.target;
  try {
    let image = "";
    if (f.photo.files[0]) image = await compress(f.photo.files[0]);
    const s = { id: nid(), plotId: Number(f.plotId.value), plantId: Number(f.plantId.value) || "", date: f.date.value, quadrat: f.quadrat.value, note: f.note.value, image, cover: null, ref: null, status: "", advice: "", analyzedAt: "" };
    db.surveys.unshift(s);
    save();
    f.reset();
    msg.textContent = "";
    show("analyze");
    document.getElementById("analyze-pick").value = s.id;
    renderAnalyze();
  } catch (err) {
    msg.textContent = "保存失败：" + err.message;
  }
};

function currentSurvey() {
  const id = Number(document.getElementById("analyze-pick").value);
  return db.surveys.find(s => s.id === id) || db.surveys[0];
}
function renderAnalyze() {
  fillSelects();
  const s = currentSurvey();
  const img = document.getElementById("ana-img");
  const canvas = document.getElementById("ana-canvas");
  if (!s) { img.removeAttribute("src"); document.getElementById("ana-advice").textContent = "还没有调查，请先上传照片。"; return; }
  img.src = s.image || "img/thumb.jpg";
  img.onload = () => { canvas.width = img.clientWidth; canvas.height = img.clientHeight; drawRoi(); };
  const crop = cropOf(s);
  document.getElementById("ref-input").value = s.ref || REF[crop] || 45;
  document.getElementById("ana-metrics").innerHTML = s.cover == null ? "" : `<span class="pill ${s.status.includes("低于") ? "bad" : s.status.includes("高于") ? "warn" : "ok"}">覆盖度 ${Number(s.cover).toFixed(1)}%</span><span class="pill">参考值 ${s.ref}%</span><span class="pill">${s.status}</span>`;
  document.getElementById("ana-advice").textContent = s.advice || "框选后点计算。不框选则计算整张照片。";
}
function drawRoi() {
  const canvas = document.getElementById("ana-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!roi) return;
  ctx.strokeStyle = "#f0c14a";
  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(240,193,74,.15)";
  ctx.fillRect(roi.x, roi.y, roi.w, roi.h);
  ctx.strokeRect(roi.x, roi.y, roi.w, roi.h);
}
document.getElementById("ana-canvas").onmousedown = e => {
  const r = e.target.getBoundingClientRect();
  drag = { x: e.clientX - r.left, y: e.clientY - r.top };
  roi = { x: drag.x, y: drag.y, w: 0, h: 0 };
};
document.getElementById("ana-canvas").onmousemove = e => {
  if (!drag) return;
  const r = e.target.getBoundingClientRect();
  roi.w = e.clientX - r.left - drag.x;
  roi.h = e.clientY - r.top - drag.y;
  drawRoi();
};
window.onmouseup = () => { drag = null; };
document.getElementById("reset-roi").onclick = () => { roi = null; drawRoi(); };
document.getElementById("analyze-pick").onchange = () => { roi = null; renderAnalyze(); };
document.getElementById("calc-btn").onclick = () => {
  const s = currentSurvey();
  if (!s) return;
  const img = document.getElementById("ana-img");
  const c = document.createElement("canvas");
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);
  let x = 0, y = 0, w = c.width, h = c.height;
  if (roi && Math.abs(roi.w) > 8 && Math.abs(roi.h) > 8) {
    const sx = c.width / img.clientWidth, sy = c.height / img.clientHeight;
    x = Math.min(roi.x, roi.x + roi.w) * sx;
    y = Math.min(roi.y, roi.y + roi.h) * sy;
    w = Math.abs(roi.w) * sx; h = Math.abs(roi.h) * sy;
  }
  const data = ctx.getImageData(x, y, Math.max(1, w), Math.max(1, h));
  const cover = coverage(data);
  const crop = cropOf(s);
  const ref = Number(document.getElementById("ref-input").value) || REF[crop] || 45;
  s.cover = cover; s.ref = ref; s.status = statusOf(cover, ref);
  s.advice = adviceText(crop, cover, ref);
  s.analyzedAt = new Date().toLocaleString();
  s.mask = maskFrom(data);
  save(); renderAll(); show("analyze");
};
function coverage(imageData) {
  const d = imageData.data;
  let crop = 0, total = 0;
  for (let i = 0; i < d.length; i += 16) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    if (max < 35) continue;
    total++;
    if (b > r + 18 && b > g && sat > 0.12) continue;
    const green = g > r * 1.08 && g > b * 1.08 && sat > 0.15 && g > 45;
    const yellow = r > 110 && g > 90 && b < 120 && g > b * 1.2 && sat > 0.22 && r < 220;
    if (green || yellow) crop++;
  }
  return total ? +(crop / total * 100).toFixed(1) : 0;
}
function maskFrom(imageData) {
  const c = document.createElement("canvas");
  c.width = imageData.width; c.height = imageData.height;
  const ctx = c.getContext("2d");
  const out = ctx.createImageData(c.width, c.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i], g = imageData.data[i + 1], b = imageData.data[i + 2];
    const green = g > r * 1.08 && g > b * 1.08;
    out.data[i] = green ? 40 : r; out.data[i + 1] = green ? 160 : g; out.data[i + 2] = green ? 70 : b; out.data[i + 3] = 255;
  }
  ctx.putImageData(out, 0, 0);
  return c.toDataURL("image/jpeg", 0.7);
}

function renderAdvice() {
  document.getElementById("advice-list").innerHTML = db.surveys.filter(s => s.advice).map(s => `
    <div class="card"><div class="card-title">${s.date} · ${plotName(s.plotId)} · ${cropOf(s)}</div><div class="advice">${s.advice}</div></div>`).join("") || "<div class='card'>还没有分析结果。</div>";
}
function renderRecords() {
  const q = (document.getElementById("rec-search").value || "").trim();
  const rows = db.surveys.filter(s => !q || (plotName(s.plotId) + s.date).includes(q));
  document.getElementById("rec-table").innerHTML = rows.map(s => `
    <tr><td>${s.date}</td><td>${plotName(s.plotId)}</td><td>${cropOf(s)}</td><td>${s.cover == null ? "—" : s.cover + "%"}</td><td>${s.status || "未分析"}</td>
    <td><button class="btn btn-line" data-rep="${s.id}">报告</button></td></tr>`).join("");
  document.querySelectorAll("[data-rep]").forEach(b => b.onclick = () => { reportId = Number(b.dataset.rep); show("report"); });
}
document.getElementById("rec-search").oninput = renderRecords;
function renderReport() {
  const s = db.surveys.find(x => x.id === reportId) || db.surveys[0];
  const box = document.getElementById("report-body");
  if (!s) { box.innerHTML = "还没有调查记录。"; return; }
  const p = db.plots.find(x => x.id === s.plotId) || {};
  const plant = plantOf(s.plantId) || {};
  box.innerHTML = `
    <h3>苗情调查报告</h3>
    <p>地块：${p.name || "—"}　位置：${p.place || "—"}　面积：${p.area || "—"} 亩　土壤：${p.soil || "—"}</p>
    <p>作物：${plant.crop || cropOf(s)}　品种：${plant.variety || "—"}　播期：${plant.sow || "—"}</p>
    <p>调查日期：${s.date}　样方面积：${s.quadrat || "—"} ㎡　分析时间：${s.analyzedAt || "—"}</p>
    <p>覆盖度：${s.cover == null ? "—" : s.cover + "%"}　参考值：${s.ref == null ? "—" : s.ref + "%"}　苗情状态：${s.status || "未分析"}</p>
    <div class="two"><div><p>原图</p><img src="${s.image || "img/thumb.jpg"}" /></div><div><p>植被分析图</p><img src="${s.mask || s.image || "img/thumb.jpg"}" /></div></div>
    <h4>农事辅助建议</h4>
    <div class="advice">${s.advice || "接近参考值时维持现有水肥；若尚未分析，请先计算覆盖度。"}</div>`;
}
document.getElementById("print-btn").onclick = () => window.print();

function renderHome() {
  const pending = db.surveys.filter(s => s.status && s.status !== "接近参考值").length;
  document.getElementById("stats").innerHTML = [
    ["地块数量", db.plots.length], ["种植档案", db.plants.length], ["调查记录", db.surveys.length], ["待关注", pending]
  ].map(x => `<div class="stat"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("");
  const last = db.surveys.find(s => s.advice);
  document.getElementById("home-advice").textContent = last ? last.advice : "完成一次图像分析后，这里会显示下一步农事建议。";
}
function renderAll() {
  fillSelects(); renderPlots(); renderPlants(); renderRecords(); renderHome(); renderAdvice();
}
document.getElementById("survey-form").date.value = new Date().toISOString().slice(0, 10);
renderAll();
show("plots");
