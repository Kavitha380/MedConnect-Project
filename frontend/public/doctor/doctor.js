let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let currentId = null;

// LOAD ON PAGE OPEN
window.onload = function () {
  loadAppointments();
};

// DISPLAY APPOINTMENTS
function loadAppointments() {
  let html = "";

  if (appointments.length === 0) {
    html = "<p>No appointments found</p>";
  }

  appointments.forEach(app => {
    html += `
      <div class="card">
        <h3>${app.patientName}</h3>
        <p>Doctor: ${app.doctor}</p>
        <p>Date: ${app.date} | ${app.time}</p>
        <p>Status: ${app.status}</p>

        <button onclick="openModal(${app.id})">View</button>
      </div>
    `;
  });

  document.getElementById("appointments").innerHTML = html;
}

// OPEN MODAL
function openModal(id) {
  currentId = id;

  let app = appointments.find(a => a.id === id);

  document.getElementById("details").innerHTML = `
    Patient: ${app.patientName}<br>
    Doctor: ${app.doctor}<br>
    Date: ${app.date}<br>
    Time: ${app.time}
  `;

  document.getElementById("symptoms").value = app.symptoms || "";
  document.getElementById("diagnosis").value = app.diagnosis || "";
  document.getElementById("prescription").value = app.prescription || "";

  document.getElementById("modal").style.display = "block";
}

// APPROVE
function approve() {
  let app = appointments.find(a => a.id === currentId);

  app.status = "Approved";

  app.symptoms = document.getElementById("symptoms").value;
  app.diagnosis = document.getElementById("diagnosis").value;
  app.prescription = document.getElementById("prescription").value;

  save();
}

// REJECT WITH REASON
function reject() {
  let reason = prompt("Enter cancellation reason:");

  let app = appointments.find(a => a.id === currentId);

  app.status = "Rejected";
  app.cancelReason = reason;

  save();
}

// SAVE DATA
function save() {
  localStorage.setItem("appointments", JSON.stringify(appointments));
  closeModal();
  loadAppointments();
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}