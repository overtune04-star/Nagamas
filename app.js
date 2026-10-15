// KONFIGURASI PENJUAL: ganti dengan nomor WhatsApp dalam format internasional,
// hanya angka. Contoh nomor Indonesia: 6281234567890 (tanpa tanda + atau spasi).
const sellerWhatsApp = "6285740960426";

const products = [
  { name: "BeAT", type: "Matic", desc: "Ringkas untuk aktivitas harian", tone: "#dddcd5", tag: "FAVORIT", image: "assets/beat.jpg" },
  { name: "Scoopy", type: "Matic", desc: "Gaya ikonik, teman beraktivitas", tone: "#e8d9d1", tag: "STYLISH", image: "assets/scoopy.jpg" },
  { name: "Vario 125", type: "Matic", desc: "Nyaman untuk perjalanan harian", tone: "#d7dce0", tag: "PRAKTIS", image: "assets/vario-125.jpg" },
  { name: "Vario 160", type: "Matic", desc: "Tampil sporty di setiap perjalanan", tone: "#d9d7df", tag: "SPORTY", image: "assets/vario-160.jpg" },
  { name: "PCX 160", type: "Matic", desc: "Kenyamanan untuk jarak lebih jauh", tone: "#d8e0dc", tag: "PREMIUM", image: "assets/pcx-160.jpg" },
  { name: "ADV 160", type: "Matic", desc: "Siap menemani perjalanan berbeda", tone: "#d8d9d4", tag: "ADVENTURE", image: "assets/adv-160.jpg" },
  { name: "CBR150R", type: "Sport", desc: "Karakter sport yang berani", tone: "#e5d8d7", tag: "SPORT", image: "assets/cbr150r.jpg" },
  { name: "Supra X 125 FI", type: "Cub", desc: "Andalan untuk keseharian", tone: "#e4dfd3", tag: "ANDALAN", image: "assets/stylo.jpg" }
];

const grid = document.querySelector("#product-grid");
const search = document.querySelector("#search");
const empty = document.querySelector("#empty-state");
let activeFilter = "Semua";

function bikeIllustration(color) {
  return `<svg class="mini-bike" viewBox="0 0 240 150" aria-hidden="true">
    <circle cx="54" cy="112" r="25" fill="#1b1b1b"/><circle cx="54" cy="112" r="14" fill="#e9e8e2"/><circle cx="54" cy="112" r="5" fill="#bbb"/>
    <circle cx="190" cy="112" r="25" fill="#1b1b1b"/><circle cx="190" cy="112" r="14" fill="#e9e8e2"/><circle cx="190" cy="112" r="5" fill="#bbb"/>
    <path d="M52 110l25-47q4-8 12-8h43q9 0 15 8l42 42-8 9-45-23h-50l-24 29z" fill="${color}"/>
    <path d="M85 59l19-23q4-5 11-5h30q6 0 9 6l10 22-14 8H94z" fill="#292929"/>
    <path d="M106 37h34l10 18H95z" fill="#444"/><path d="M180 76l21-17 10 3-6 14 19 35h-15l-28-29z" fill="#393939"/>
    <path d="M53 108l13-4 8 9-7 10H46zM198 61l17-6 5 4-6 9-14 3z" fill="#eeeae0"/>
    <path d="M95 114l10-19h39l19 19" fill="none" stroke="#393939" stroke-width="7" stroke-linecap="round"/>
  </svg>`;
}

function askSeller(name) {
  const message = `Halo, saya tertarik dengan motor Honda ${name}. Boleh minta informasi harga dan ketersediaannya?`;
  if (!sellerWhatsApp) {
    alert("Nomor WhatsApp penjual belum diatur. Isi nomor pada bagian KONFIGURASI di file app.js.");
    return;
  }
  window.open(`https://wa.me/${sellerWhatsApp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

function render() {
  const query = search.value.trim().toLowerCase();
  const visible = products.filter((item) =>
    (activeFilter === "Semua" || item.type === activeFilter) &&
    `${item.name} ${item.type} ${item.desc}`.toLowerCase().includes(query)
  );
  grid.innerHTML = visible.map((item, index) => `
    <article class="product-card" style="animation-delay:${index * 35}ms">
      <div class="product-visual" style="--wash:${item.tone}">
        <span class="product-tag">${item.tag}</span><span class="product-no">0${products.indexOf(item) + 1}</span>
        <img class="product-photo" src="${item.image}" alt="Honda ${item.name}" onerror="this.hidden=true">
        ${bikeIllustration(item.name === "BeAT" || item.name === "CBR150R" ? "#c8102e" : "#363636")}
      </div>
      <div class="product-info">
        <div class="product-type">${item.type}</div><h3 class="product-title">Honda ${item.name}</h3><p class="product-desc">${item.desc}</p>
        <div class="product-bottom"><div><div class="price-label">HARGA & STOK</div><div class="price-value">Tanya penjual</div></div>
          <button class="ask-link" type="button" aria-label="Tanya tentang Honda ${item.name}" data-product="${item.name}">↗</button></div>
      </div>
    </article>`).join("");
  empty.hidden = visible.length !== 0;
  grid.hidden = visible.length === 0;
  grid.querySelectorAll(".ask-link").forEach((button) => button.addEventListener("click", () => askSeller(button.dataset.product)));
}

document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach((filter) => filter.classList.toggle("active", filter === button));
  render();
}));
search.addEventListener("input", render);
document.querySelectorAll(".whatsapp-link").forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  askSeller("motor Honda");
}));
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    search.focus();
  }
  if (event.key === "Escape") search.blur();
});
document.querySelector("#year").textContent = new Date().getFullYear();
render();
