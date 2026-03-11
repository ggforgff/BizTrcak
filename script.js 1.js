let produkData=[]
let chartBar
let chartPie
let userAktif=""



function login(){

let username=document.getElementById("username").value
let password=document.getElementById("password").value

if(username==""){
alert("Username harus diisi")
return
}

if(password.length<8){
alert("Password minimal 8 karakter")
return
}

userAktif=username

let savedPassword=localStorage.getItem("password_"+username)

if(savedPassword==null){

localStorage.setItem("password_"+username,password)

}else{

if(password!==savedPassword){
alert("Password salah")
return
}

}

document.getElementById("loginPage").style.display="none"
document.getElementById("dashboard").style.display="block"

document.getElementById("namaUser").innerText="User : "+username
document.getElementById("tanggalLogin").innerText="Tanggal : "+new Date().toLocaleDateString()

produkData=[]

buatGrafik()
buatPie()

loadData()
renderTabel()
updateGrafik()
updateProgress()
produkTerlaris()
totalPenjualan()

}



function logout(){

location.reload()

}



function tambahProduk(){

let nama=document.getElementById("namaProduk").value
let jumlah=parseInt(document.getElementById("jumlahProduk").value)

if(!nama||!jumlah){
alert("Isi produk")
return
}

produkData.push({nama:nama,jumlah:jumlah})

renderTabel()
updateGrafik()
updateProgress()
produkTerlaris()
totalPenjualan()

simpanData()

document.getElementById("namaProduk").value=""
document.getElementById("jumlahProduk").value=""

}



function renderTabel(){

let tabel=document.getElementById("tabelProduk")

tabel.innerHTML=""

produkData.forEach((p,i)=>{

let row=tabel.insertRow()

row.insertCell(0).innerText=p.nama
row.insertCell(1).innerText=p.jumlah

row.insertCell(2).innerHTML=
`<button onclick="hapus(${i})">Hapus</button>`

})

}



function hapus(i){

produkData.splice(i,1)

renderTabel()
updateGrafik()
updateProgress()
produkTerlaris()
totalPenjualan()

simpanData()

}



function buatGrafik(){

let ctx=document.getElementById("grafikPenjualan")

chartBar=new Chart(ctx,{
type:"bar",
data:{
labels:[],
datasets:[{
label:"Penjualan",
data:[],
backgroundColor:[
"#3b82f6",
"#22c55e",
"#f59e0b",
"#ef4444",
"#8b5cf6",
"#06b6d4"
]
}]
}
})

}



function buatPie(){

let ctx=document.getElementById("pieChart")

chartPie=new Chart(ctx,{
type:"pie",
data:{
labels:[],
datasets:[{
data:[],
backgroundColor:[
"#3b82f6",
"#22c55e",
"#f59e0b",
"#ef4444",
"#8b5cf6"
]
}]
},
options:{maintainAspectRatio:false}
})

}



function updateGrafik(){

let labels=produkData.map(p=>p.nama)
let data=produkData.map(p=>p.jumlah)

chartBar.data.labels=labels
chartBar.data.datasets[0].data=data
chartBar.update()

chartPie.data.labels=labels
chartPie.data.datasets[0].data=data
chartPie.update()

}



function updateProgress(){

let total=produkData.reduce((a,b)=>a+b.jumlah,0)

let persen=(total/500)*100
if(persen>100)persen=100

document.getElementById("progressBar").style.width=persen+"%"

let badge="🟢 Starter"

if(total>=50) badge="🟡 Growing"
if(total>=150) badge="🔵 Pro"

if(total>=500){
badge="🏆 Master"
animasiMaster()
}

document.getElementById("badgeLevel").innerText=
"Level : "+badge+" ("+total+"/500)"

}



function produkTerlaris(){

if(produkData.length==0){
document.getElementById("produkTerlaris").innerText="🏆 Belum ada produk"
return
}

let max=produkData.reduce((a,b)=>a.jumlah>b.jumlah?a:b)

document.getElementById("produkTerlaris").innerText=
"🏆 Produk Terlaris : "+max.nama+" ("+max.jumlah+" terjual)"

}



function totalPenjualan(){

let total=produkData.reduce((a,b)=>a+b.jumlah,0)

document.getElementById("totalPenjualan").innerText=
"Total Penjualan : "+total

}



function animasiMaster(){

document.getElementById("rewardMaster").style.display="flex"

confetti({
particleCount:200,
spread:150,
origin:{y:0.6}
})

}



function tutupReward(){

document.getElementById("rewardMaster").style.display="none"

}



function simpanData(){

localStorage.setItem("data_"+userAktif,JSON.stringify(produkData))

}



function loadData(){

let data=localStorage.getItem("data_"+userAktif)

if(data){

produkData=JSON.parse(data)

}else{

produkData=[]

}

}