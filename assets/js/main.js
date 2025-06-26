import { callAPI } from "./api.js"; 


const apodTitle = document.getElementById('apodTitle');
const apodImage = document.getElementById('apodImage');
const apodExplanation = document.getElementById('apodExplanation');
const apodGallery = document.getElementById('apodGallery');



//AL INICIAR CARGA CON LA FECHA DE HOY
document.addEventListener("DOMContentLoaded", () => {
  callAPI()
    .then(data => renderAPOD(data))
    .catch(error => showError(error));
});

function renderAPOD(data) {
  apodTitle.textContent = data.title;
  apodExplanation.textContent = data.explanation;
  apodImage.src = data.url;
  
  apodImage.style.cursor = "pointer";
  apodImage.onclick = () => openModal(data);
}

function showError(error) {
  apodTitle.textContent = "Error cargando APOD";
  apodExplanation.textContent = error.message;
  apodImage.src = '';
}

//SELECTOR DE FECHA CON CAMBIO EN LOS DATOS
const datePicker = document.getElementById('apodDatePicker');

datePicker.addEventListener('change', (event) => {
    const selectedDate = event.target.value;
    const dateParam = `&date=${selectedDate}`;

    callAPI(dateParam)
        .then(data => renderAPOD(data))
        .catch(error => showError(error));

    loadLast5Days();
});


//FORMATEAMOS FECHA
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

//OBTENEMOS LOS X DIAS ANTERIORES A LA FECHA
function getLastNDates(n, baseDate = new Date()) {
  const dates = [];

  for (let i = 1; i <= n; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }

  return dates;
}

/** CARGA DE DATOS PARA LA GALERIA */
function loadLast5Days() {
  const selectedDateStr = document.getElementById('apodDatePicker').value;

  const baseDate = selectedDateStr ? new Date(selectedDateStr) : new Date();

  const dates = getLastNDates(5, baseDate);

  const requests = dates.map(date => callAPI(`&date=${date}`));

  Promise.all(requests)
    .then(results => {
      apodGallery.innerHTML = '';
      results.forEach(data => {
        const card = createAPODCard(data);
        apodGallery.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error cargando galería:", err);
    });
}


/** CARGA DE DATOS EN LAS TARJETAS DE LA GALERIA Y APERTURA DEL MODAL */
function createAPODCard(data) {
  const card = document.createElement("div");
  card.className = "galaxy-card";

  const title = document.createElement("h2");
  title.textContent = data.title;

  const image = document.createElement("img");
  image.className = "galaxy-img";
  image.src = data.url;
  image.alt = data.title;

  const explanation = document.createElement("p");
  explanation.textContent = data.explanation;
  
  card.addEventListener("click", () => openModal(data));

  card.appendChild(title);
  card.appendChild(image);
  card.appendChild(explanation);

  return card;
}

document.addEventListener("DOMContentLoaded", () => {
  loadLast5Days();
});




/** VENTANA MODAL */
const modal = document.getElementById("apodModal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalExplanation = document.getElementById("modalExplanation");
const modalDownload = document.getElementById("modalDownload");
const modalClose = document.getElementById("modalClose");

function openModal(data) {
  modalTitle.textContent = data.title;
  modalImage.src = data.hdurl || data.url;
  modalExplanation.textContent = data.explanation;
  modalDownload.href = data.hdurl || data.url;

  modal.classList.remove("hidden");
}

modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});