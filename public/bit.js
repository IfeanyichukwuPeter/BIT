fetch("components/nav.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("nav").innerHTML = data;
    initMenu();
  });

fetch("components/footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });

function initMenu() {
  const menu = document.getElementById("menu");
  const oldBtn = document.getElementById("menu-btn");

  if (!menu || !oldBtn) return;

  const menuBtn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(menuBtn, oldBtn);

  const menuIcon = menuBtn.querySelector("#burger");

  menuBtn.addEventListener("click", () => {
    console.log("clicked");

    menu.classList.toggle("active");
    const isOpen = menu.classList.contains("active");

    menuIcon.style.opacity = "0";

    setTimeout(() => {
      menuIcon.src = isOpen
        ? "/public/bitimg/icon-close.svg"
        : "/public/bitimg/icon-hamburger.svg";

      menuIcon.style.opacity = "1";
    }, 150);
    menuIcon.style.transform = isOpen ? "rotate(90deg)" : "rotate(0deg)";
  });
}

// QUESTIONS ARRAY

let questions = [];
let adminToken = localStorage.getItem("adminToken") || null;

async function loadQuestions() {
  const response = await fetch("/api/questions");

  if (!response.ok) {
    throw new Error("Failed to load questions.");
  }

  questions = await response.json();
}

async function adminLogin(username, password) {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error("Invalid username or password.");
  }

  const data = await response.json();
  adminToken = data.token;
  localStorage.setItem("adminToken", adminToken);

  return data;
}

function adminLogout() {
  adminToken = null;
  localStorage.removeItem("adminToken");
}

async function createQuestion(payload) {
  const response = await fetch("/api/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to submit question.");
  }

  return response.json();
}

async function updateQuestion(id, payload) {
  const response = await fetch(`/api/questions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to update question.");
  }

  return response.json();
}

async function removeQuestion(id) {
  const response = await fetch(`/api/questions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${adminToken}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to delete question.");
  }
}

// PUBLIC CONTACT PAGE

const questionForm = document.getElementById("questionForm");
const answeredContainer = document.getElementById("answeredQuestions");

if (questionForm) {
  questionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim() || "Anonymous";
    const questionText = document.getElementById("question").value.trim();

    if (!questionText) return alert("Please enter a question.");

    try {
      const newQuestion = await createQuestion({
        name,
        question: questionText
      });

      questions.push(newQuestion);
      questionForm.reset();

      alert("Your question has been submitted! Answers will appear in the 'Answered Questions' section once answered.");

      renderAnswered();
      renderAdminQuestions();
    } catch (error) {
      alert("Unable to submit your question right now.");
    }
  });
}

function renderAnswered() {
  if (!answeredContainer) return;

  answeredContainer.innerHTML = "";

  questions
    .filter(q => q.status === "answered")
    .forEach(q => {
      const card = document.createElement("div");
      card.className = "qa-card";

      card.innerHTML = `
        <p class="question"><strong>Q.</strong> ${q.question}</p>
        <p class="answer"><strong>A.</strong> ${q.answer}</p>
      `;

      answeredContainer.appendChild(card);
    });
}

// ADMIN PASSWORD LOGIN
const ADMIN_PASSWORD = "BITadmin123";

const loginContainer = document.getElementById("adminLogin");
const adminSection = document.getElementById("adminSection");
const loginBtn = document.getElementById("adminLoginBtn");
const loginMessage = document.getElementById("loginMessage");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("adminUsername")?.value || "admin";
    const password = document.getElementById("adminPassword").value;

    if (!password) {
      loginMessage.textContent = "Please enter a password.";
      return;
    }

    try {
      await adminLogin(username, password);
      loginContainer.style.display = "none";
      adminSection.style.display = "block";
      loginMessage.textContent = "";
      renderAdminQuestions();
    } catch (error) {
      loginMessage.textContent = "Incorrect credentials. Try again.";
    }
  });
}

if (loginContainer) {
  const pwdInput = document.getElementById("adminPassword");
  pwdInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") loginBtn.click();
  });
}

// Logout handler
const logoutLink = document.querySelector(".admin-nav a:nth-child(4)");
if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    adminLogout();
    loginContainer.style.display = "block";
    adminSection.style.display = "none";
    document.getElementById("adminUsername").value = "";
    document.getElementById("adminPassword").value = "";
    loginMessage.textContent = "";
  });
}

// ADMIN PANEL
const adminContainer = document.getElementById("adminQuestions");

function renderAdminQuestions() {
  if (!adminContainer) return;

  adminContainer.innerHTML = "";

  questions.forEach(q => {
    const card = document.createElement("div");
    card.className = "admin-q-card";

    card.innerHTML = `
      <p><strong>Name:</strong> ${q.name}</p>
      <p><strong>Question:</strong> ${q.question}</p>
      ${
        q.status === "answered"
          ? `<p><strong>Answer:</strong> ${q.answer}</p>`
          : `<textarea data-id="${q.id}" placeholder="Type reply...">${q.answer}</textarea>
             <button data-id="${q.id}">Send Reply</button>
             <button class="delete-btn" data-id="${q.id}">Delete</button>`
      }
      <p>Status: ${q.status}</p>
      <hr>
    `;

    adminContainer.appendChild(card);
  });

  attachReplyHandlers();
  attachDeleteHandlers();
}

function attachReplyHandlers() {
  const buttons = adminContainer.querySelectorAll("button:not(.delete-btn)");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const textarea = adminContainer.querySelector(`textarea[data-id="${id}"]`);

      const reply = textarea.value.trim();
      if (!reply) return alert("Type a reply before sending.");

      updateQuestion(id, { answer: reply })
        .then((updated) => {
          questions = questions.map((item) =>
            item.id == updated.id ? updated : item
          );
          renderAdminQuestions();
          renderAnswered();
        })
        .catch(() => {
          alert("Unable to send reply right now.");
        });
    });
  });
}

function attachDeleteHandlers() {
  const deleteButtons = adminContainer.querySelectorAll(".delete-btn");

  deleteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");

      const confirmDelete = confirm("Are you sure you want to delete this question?");
      if (!confirmDelete) return;

      removeQuestion(id)
        .then(() => {
          questions = questions.filter(q => q.id != id);
          renderAdminQuestions();
          renderAnswered();
        })
        .catch(() => {
          alert("Unable to delete question right now.");
        });
    });
  });
}

loadQuestions()
  .then(() => {
    renderAnswered();
    renderAdminQuestions();
  })
  .catch(() => {
    renderAnswered();
  });

  //EVENTS

  const eventForm = document.getElementById("eventForm");
const adminEventsContainer = document.getElementById("adminEvents");

const eventTitleInput = document.getElementById("eventTitle");
const eventDateInput = document.getElementById("eventDate");
const eventDescriptionInput = document.getElementById("eventDescription");
const eventImageInput = document.getElementById("eventImage");

let events = [];
let editingEventId = null;

async function loadEvents() {
  try {
    const res = await fetch("/api/events");

    if (!res.ok) throw new Error("Failed to fetch events");

    events = await res.json();
    renderEvents();
  } catch (err) {
    console.error(err);
  }
}

function renderEvents() {
  if (!adminEventsContainer) return;

  adminEventsContainer.innerHTML = "";

  if (events.length === 0) {
    adminEventsContainer.innerHTML = "<p>No events yet</p>";
    return;
  }

  events.forEach(ev => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${ev.title}</h3>
      <p>${ev.date || ""}</p>
      <button data-id="${ev.id}" class="edit-event">Edit</button>
      <button data-id="${ev.id}" class="delete-event">Delete</button>
      <hr>
    `;

    adminEventsContainer.appendChild(div);
  });

  attachEventActions();
}

if (eventForm) {
  eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", eventTitleInput.value);
    formData.append("date", eventDateInput.value);
    formData.append("description", eventDescriptionInput.value);

    if (eventImageInput.files[0]) {
      formData.append("image", eventImageInput.files[0]);
    }

    let url = "/api/events";
    let method = "POST";

    if (editingEventId) {
      url = `/api/events/${editingEventId}`;
      method = "PATCH";
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${adminToken}`
        },
        body: formData
      });

      if (!res.ok) throw new Error("Failed to save event");

      editingEventId = null;
      eventForm.reset();

      await loadEvents();
    } catch (err) {
      alert("Error saving event");
    }
  });
}

function attachEventActions() {
  document.querySelectorAll(".edit-event").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const ev = events.find(e => e.id == id);

      editingEventId = id;

      eventTitleInput.value = ev.title || "";
      eventDateInput.value = ev.date || "";
      eventDescriptionInput.value = ev.description || "";
    });
  });

  document.querySelectorAll(".delete-event").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const confirmDelete = confirm("Delete this event?");
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/events/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });

        if (!res.ok) throw new Error();

        await loadEvents();
      } catch {
        alert("Failed to delete event");
      }
    });
  });
}

loadEvents();
