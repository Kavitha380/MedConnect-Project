// ---------------- DOCTOR DATA ----------------
let doctors = JSON.parse(localStorage.getItem("doctors")) || [
  { id: 1, name: "Dr. John", spec: "Cardiology", status: "Available" },
  { id: 2, name: "Dr. Priya", spec: "Neurology", status: "Busy" },
  { id: 3, name: "Dr. Ahmed", spec: "Orthopedic", status: "Available" },
  { id: 4, name: "Dr. Meena", spec: "Dermatology", status: "Available" }
];

localStorage.setItem("doctors", JSON.stringify(doctors));

// ---------------- LOAD PAGE ----------------
window.onload = function () {
  if (document.getElementById("doctorList")) {
    displayDoctors(doctors);
  }

  if (window.location.pathname.includes("appointments")) {
    loadAppointments();
  }

  if (window.location.pathname.includes("profile")) {
    loadProfile();
  }

  if (window.location.pathname.includes("book-appointment")) {
    document.getElementById("doctor").value =
      localStorage.getItem("selectedDoctor");
  }
};

// ---------------- DISPLAY DOCTORS ----------------
function displayDoctors(list) {
  let html = "";

  list.forEach(doc => {
    html += `
      <div class="card">
        <h3>${doc.name}</h3>
        <p>Specialization: ${doc.spec}</p>

        <span class="status ${doc.status}">
          ${doc.status}
        </span>

        <button class="btn"
          onclick="bookDoctor('${doc.name}')"
          ${doc.status === "Busy" ? "disabled" : ""}>
          Book Appointment
        </button>
      </div>
    `;
  });

  document.getElementById("doctorList").innerHTML = html;
}

// ---------------- SEARCH ----------------
function searchDoctors(value) {
  value = value.toLowerCase();

  let filtered = doctors.filter(d =>
    d.spec.toLowerCase().includes(value) ||
    d.name.toLowerCase().includes(value)
  );

  displayDoctors(filtered);
}

// ---------------- BOOK DOCTOR ----------------
function bookDoctor(name) {
  localStorage.setItem("selectedDoctor", name);
  window.location.href = "book-appointment.html";
}

// ---------------- BOOK APPOINTMENT ----------------
function book(e) {
  e.preventDefault();

  let patient = JSON.parse(localStorage.getItem("patient")) || {};

  let data = {
    id: Date.now(),
    patientName: patient.name,
    doctor: document.getElementById("doctor").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    reason: document.getElementById("reason").value,
    status: "Pending"
  };

  let list = JSON.parse(localStorage.getItem("appointments")) || [];
  list.push(data);

  localStorage.setItem("appointments", JSON.stringify(list));

  alert("Appointment booked successfully!");
  window.location.href = "appointments.html";
}

// ---------------- LOAD APPOINTMENTS ----------------
function loadAppointments() {
  let patient = JSON.parse(localStorage.getItem("patient")) || {};
  let data = JSON.parse(localStorage.getItem("appointments")) || [];

  let filtered = data.filter(a => a.patientName === patient.name);

  let html = "";

  filtered.forEach(a => {
    html += `
      <div class="card">
        <h3>${a.doctor}</h3>
        <p>Date: ${a.date}</p>
        <p>Time: ${a.time}</p>
        <p>Status: ${a.status}</p>

        ${a.status !== "Confirmed"
          ? `<button class="btn btn-danger" onclick="cancel(${a.id})">
              Cancel
             </button>`
          : `<p style="color:green;">Confirmed</p>`
        }
      </div>
    `;
  });

  document.getElementById("appointments").innerHTML = html;
}

// ---------------- CANCEL ----------------
function cancel(id) {
  let data = JSON.parse(localStorage.getItem("appointments")) || [];

  data = data.filter(a => a.id !== id);

  localStorage.setItem("appointments", JSON.stringify(data));

  loadAppointments();
}

// ---------------- PROFILE ----------------
function loadProfile() {
  let user = JSON.parse(localStorage.getItem("patient")) || {};

  document.getElementById("name").value = user.name || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("phone").value = user.phone || "";
}

function updateProfile(e) {
  e.preventDefault();

  let user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value
  };

  localStorage.setItem("patient", JSON.stringify(user));

  alert("Profile updated!");
}

// ---------------- LOGOUT ----------------
function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}