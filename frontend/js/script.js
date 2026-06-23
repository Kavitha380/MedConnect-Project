// ================= TOAST =================
function showToast(msg){
    let toast = document.getElementById("toast");
    if(!toast){
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.innerText = msg;
    toast.style.display = "block";

    setTimeout(()=>{
        toast.style.display = "none";
    },2000);
}

// ================= REGISTER =================
function registerUser(){
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("password").value.trim();
    let role = document.getElementById("role").value;

    if(!name || !email || !pass){
        showToast("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if(users.find(u=>u.email===email)){
        showToast("User already exists");
        return;
    }

    users.push({name,email,password:pass,role});
    localStorage.setItem("users",JSON.stringify(users));

    showToast("Registered successfully");
    setTimeout(()=>location.href="login.html",1000);
}

// ================= LOGIN =================
function loginUser(){
    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u=>u.email===email && u.password===pass);

    if(!user){
        showToast("Invalid credentials");
        return;
    }

    localStorage.setItem("currentUser",JSON.stringify(user));

    showToast("Login success");

    setTimeout(()=>{
        if(user.role==="Patient") location.href="patient-dashboard.html";
        else if(user.role==="Doctor") location.href="doctor-dashboard.html";
        else location.href="admin-dashboard.html";
    },1000);
}

// ================= DOCTORS =================
function loadDoctors(){
    let doctors = JSON.parse(localStorage.getItem("doctors"));

    if(!doctors){
        doctors = [
            {name:"Dr. Arun Kumar", spec:"Cardiologist"},
            {name:"Dr. Priya Sharma", spec:"Dermatologist"},
            {name:"Dr. John Mathew", spec:"Neurologist"}
        ];
        localStorage.setItem("doctors",JSON.stringify(doctors));
    }

    let box = document.getElementById("doctorList");
    box.innerHTML="";

    doctors.forEach((d,i)=>{
        box.innerHTML += `
        <div class="card">
            <h3>${d.name}</h3>
            <p>${d.spec}</p>
            <input id="date${i}" placeholder="Date (YYYY-MM-DD)">
            <input id="time${i}" placeholder="Time">
            <button class="btn primary" onclick="book(${i})">Book</button>
        </div>`;
    });
}

// ================= BOOK =================
function book(i){
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let doctors = JSON.parse(localStorage.getItem("doctors"));

    let date = document.getElementById("date"+i).value;
    let time = document.getElementById("time"+i).value;

    if(!date || !time){
        showToast("Enter date & time");
        return;
    }

    let appts = JSON.parse(localStorage.getItem("appointments")) || [];

    appts.push({
        patient:user.name,
        doctor:doctors[i].name,
        date,time
    });

    localStorage.setItem("appointments",JSON.stringify(appts));

    showToast("Appointment booked");
}

// ================= PATIENT DASHBOARD =================
function loadPatient(){
    let user = JSON.parse(localStorage.getItem("currentUser"));
    document.getElementById("name").innerText = user.name;

    let appts = JSON.parse(localStorage.getItem("appointments")) || [];

    let mine = appts.filter(a=>a.patient===user.name);

    let box = document.getElementById("myAppts");
    box.innerHTML="";

    mine.forEach(a=>{
        box.innerHTML += `
        <div class="card">
            <h3>${a.doctor}</h3>
            <p>${a.date} | ${a.time}</p>
        </div>`;
    });
}