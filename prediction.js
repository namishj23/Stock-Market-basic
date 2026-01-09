// ===== ELEMENTS =====
const stockSelect = document.querySelector("select");
const bullishCard = document.querySelector(".bullish");
const bearishCard = document.querySelector(".bearish");
const textarea = document.querySelector("textarea");
const wordCountText = document.querySelector(".hint span");
const checkbox = document.querySelector(".confirm input");
const submitBtn = document.querySelector(".submit");

let selectedDirection = null;

// ===== DIRECTION SELECTION =====
bullishCard.addEventListener("click", () => {
  selectDirection("UP");
});

bearishCard.addEventListener("click", () => {
  selectDirection("DOWN");
});

function selectDirection(direction) {
  selectedDirection = direction;

  bullishCard.classList.remove("selected");
  bearishCard.classList.remove("selected");

  if (direction === "UP") {
    bullishCard.classList.add("selected");
  } else {
    bearishCard.classList.add("selected");
  }
}

// ===== WORD COUNTER =====
textarea.addEventListener("input", () => {
  const words = textarea.value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const count = words.length;
  wordCountText.textContent = `${count} / 50 words`;

  if (count >= 50) {
    wordCountText.style.color = "#22c55e";
  } else {
    wordCountText.style.color = "#94a3b8";
  }
});

// ===== SUBMIT HANDLER =====
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const stock = stockSelect.value;
  const words = textarea.value.trim().split(/\s+/).filter(Boolean).length;

  // VALIDATIONS
  if (!stock || stock === "Select a stock…") {
    alert("Please select a stock.");
    return;
  }

  if (!selectedDirection) {
    alert("Please select a prediction direction.");
    return;
  }

  if (words < 50) {
    alert("Your analysis must be at least 50 words.");
    return;
  }

  if (!checkbox.checked) {
    alert("You must confirm that you are 18+ and agree to the terms.");
    return;
  }

  // LOCK UI
  submitBtn.disabled = true;
  submitBtn.textContent = "🔒 Prediction Locked";
  submitBtn.style.opacity = "0.7";
  submitBtn.style.cursor = "not-allowed";

  // DISABLE INPUTS
  stockSelect.disabled = true;
  textarea.disabled = true;
  checkbox.disabled = true;
  bullishCard.style.pointerEvents = "none";
  bearishCard.style.pointerEvents = "none";

  console.log("Prediction Submitted:", {
    stock,
    direction: selectedDirection,
    analysis: textarea.value,
  });

  alert("✅ Your prediction has been locked successfully!");
});
