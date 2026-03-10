// =================
// DATA & VARIABEL
// =================
let produkData = [];
let chartBar;
let chartPie;

// =================
// LOGIN
// =================
function login() {
    let username = document.getElementById("username").value;
    if (username === "") {
        alert("Masukkan nama dulu");
        return;
    }

    // tampilkan dashboard, sembunyikan login
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "flex";

    // tampilkan nama user & tanggal login
    document.getElementById("namaUser").innerText = "👤 " + username;
    let today = new Date();
    document.getElementById("tanggalLogin").innerText = "📅 " + today.toLocaleDateString();

    // buat grafik & load data
    buatGrafikBar();
    buatPieChart();
    loadData();
    updateProgress();
    updateProdukTerlaris();
}

// =================
// TAMBAH PRODUK
// =================
function tambahProduk() {
    let nama = document.getElementById("namaProduk").value;
    let jumlah = parseInt(document.getElementById("jumlahProduk").value);

    if (!nama || !jumlah) {
        alert("Isi nama dan jumlah produk");
        return;
    }

    produkData.push({ nama: nama, jumlah: jumlah });

    renderTabel();
    updateGrafik();
    updateProgress();
    updateProdukTerlaris();
    simpanData();

    // reset input
    document.getElementById("namaProduk").value = "";
    document.getElementById("jumlahProduk").value = "";
}

// =================
// HAPUS PRODUK
// =================
function hapusProduk(index) {
    produkData.splice(index, 1);
    renderTabel();
    updateGrafik();
    updateProgress();
    updateProdukTerlaris();
    simpanData();
}

// =================
// RENDER TABEL
// =================
function renderTabel() {
    let tabel = document.getElementById("tabelProduk");
    tabel.innerHTML = "";

    produkData.forEach(function (p, i) {
        let row = tabel.insertRow();
        row.insertCell(0).innerText = p.nama;
        row.insertCell(1).innerText = p.jumlah;
        row.insertCell(2).innerHTML = `<button onclick="hapusProduk(${i})">Hapus</button>`;
    });
}

// =================
// PROGRESS BISNIS & BADGE
// =================
function updateProgress() {
    let totalJumlah = produkData.reduce((a, b) => a + b.jumlah, 0);
    let progress = totalJumlah; // bisa ubah rumus sesuai target
    if (progress > 100) progress = 100;

    document.getElementById("progressBar").style.width = progress + "%";

    let badge = "🟢 Starter";
    if (progress >= 30) badge = "🟡 Growing";
    if (progress >= 70) badge = "🔵 Pro";
    if (progress >= 100) badge = "🏆 Master";

    document.getElementById("badgeLevel").innerText = badge;
}

// =================
// PRODUK TERLARIS
// =================
function updateProdukTerlaris() {
    if (produkData.length === 0) {
        document.getElementById("produkTerlaris").innerText = "Belum ada data";
        return;
    }

    let maxProduk = produkData[0];
    produkData.forEach(p => {
        if (p.jumlah > maxProduk.jumlah) maxProduk = p;
    });

    document.getElementById("produkTerlaris").innerText =
        `🏆 ${maxProduk.nama} (${maxProduk.jumlah} terjual)`;
}

// =================
// GRAFIK BATANG
// =================
function buatGrafikBar() {
    let ctx = document.getElementById("grafikPenjualan").getContext("2d");
    chartBar = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "Jumlah Produk",
                data: [],
                backgroundColor: "#3b82f6"
            }]
        },
        options: { responsive: true }
    });
}

// =================
// PIE CHART
// =================
function buatPieChart() {
    let ctx = document.getElementById("piePenjualan").getContext("2d");
    chartPie = new Chart(ctx, {
        type: "pie",
        data: { labels: [], datasets: [{ data: [], backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"] }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// =================
// UPDATE GRAFIK
// =================
function updateGrafik() {
    let labels = produkData.map(p => p.nama);
    let data = produkData.map(p => p.jumlah);

    chartBar.data.labels = labels;
    chartBar.data.datasets[0].data = data;
    chartBar.update();

    chartPie.data.labels = labels;
    chartPie.data.datasets[0].data = data;
    chartPie.update();
}

// =================
// SIMPAN & LOAD DATA
// =================
function simpanData() {
    localStorage.setItem("biztrackData", JSON.stringify(produkData));
}

function loadData() {
    let data = localStorage.getItem("biztrackData");
    if (data) {
        produkData = JSON.parse(data);
        renderTabel();
        updateGrafik();
    }
}