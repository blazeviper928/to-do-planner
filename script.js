let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

/* 👤 USER SETUP */
let name = localStorage.getItem("username");
let profilePic = localStorage.getItem("profilePic");

if (!name) {
  name = prompt("Enter your name 😊");
  localStorage.setItem("username", name);
}

document.getElementById("userName").innerText = name;

/* 🖼️ Profile */
const img = document.getElementById("profilePic");
const upload = document.getElementById("uploadPic");

if (profilePic) img.src = profilePic;

upload.addEventListener("change", () => {
  const file = upload.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    localStorage.setItem("profilePic", reader.result);
    img.src = reader.result;
  };

  reader.readAsDataURL(file);
});

/* 🌅 Greeting */
const hour = new Date().getHours();

let greeting = hour < 12 ? "Good Morning ☀️"
  : hour < 18 ? "Good Afternoon 🌤️"
  : "Good Evening 🌙";

let text = `${greeting}, ${name} 😎`;

/* 💖 Typing */
let i = 0;
function type() {
  if (i < text.length) {
    document.getElementById("welcomeText").innerHTML += text[i];
    i++;
    setTimeout(type, 70);
  }
}
type();

/* Hide + Music */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("welcome").style.display = "none";
    document.getElementById("bgMusic").play().catch(()=>{});
  }, 3000);
});

/* 💕 Hearts */
setInterval(() => {
  const heart = document.createElement("div");
  heart.innerHTML = "💖";
  heart.className = "heart";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = Math.random() * 20 + 10 + "px";

  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}, 500);

/* ➕ Add Task */
function addTask() {
  const input = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const priorityInput = document.getElementById("priority");

  const text = input.value.trim();
  if (!text) return alert("Enter task!");

  tasks.push({
    text,
    date: dateInput.value,
    priority: priorityInput.value,
    completed: false
  });

  save();

  input.value = "";
  dateInput.value = "";
  priorityInput.value = "low";
  input.focus();

  showToast("Task added ✨");
}

/* Save */
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

/* Display */
function displayTasks() {
  const list = document.getElementById("taskList");
  const search = document.getElementById("search").value.toLowerCase();

  list.innerHTML = "";

  let filtered = tasks
    .map((t, i) => ({ ...t, i }))
    .filter(t => t.text.toLowerCase().includes(search));

  if (filter === "pending") filtered = filtered.filter(t => !t.completed);
  if (filter === "completed") filtered = filtered.filter(t => t.completed);

  filtered.forEach(t => {
    list.innerHTML += `
      <li class="${t.completed ? 'completed' : ''} ${t.priority}">
        <span onclick="toggleTask(${t.i})">${t.text}</span><br>
        <small>${t.date || ""}</small><br>
        <button onclick="deleteTask(${t.i})">❌</button>
      </li>
    `;
  });

  updateProgress();
}

/* Toggle */
function toggleTask(i) {
  tasks[i].completed = !tasks[i].completed;
  save();
}

/* Delete */
function deleteTask(i) {
  tasks.splice(i, 1);
  save();
}

/* Progress */
function updateProgress() {
  const done = tasks.filter(t => t.completed).length;
  const percent = tasks.length ? (done / tasks.length) * 100 : 0;
  document.getElementById("progress").style.width = percent + "%";
}

/* Toast */
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.opacity = 1;

  setTimeout(() => {
    toast.style.opacity = 0;
  }, 2000);
}

displayTasks();
