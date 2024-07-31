const container = document.querySelector(".controls");
const output = document.getElementById("prompt-output");
const copyBtn = document.getElementById("copy-btn");
const randomizeBtn = document.getElementById("randomize-btn");
const tabButtons = document.querySelectorAll(".tab-button");
const toast = document.getElementById("toast");
const dataSelect = document.getElementById("data-select");

const defaultCategories = [
  "type",
  "race",
  "subject",
  "descriptor",
  "lighting",
  "camera",
  "film",
];

const icons = {
  type: "ph-image",
  age: "ph-calendar",
  race: "ph-globe",
  subject: "ph-user",
  descriptor: "ph-smiley-sticker",
  action: "ph-sneaker-move",
  location: "ph-map-pin",
  clothing: "ph-t-shirt",
  style: "ph-paint-brush",
  lighting: "ph-sun",
  color: "ph-palette",
  visualFX: "ph-magic-wand",
  camera: "ph-camera",
  lens: "ph-eye",
  film: "ph-film-strip",
};

let currentData = {};
let categories = [];

const loadData = async (file) => {
  try {
    const response = await fetch(file);
    const moduleText = await response.text();
    const dataFunction = new Function(`return ${moduleText.split("=")[1].trim()}`);
    return dataFunction();
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
};

const initializeData = async () => {
  const data = await loadData("./data/data.js");
  if (data) {
    currentData = data;
    categories = Object.keys(currentData);
    initializeControls();
    updatePrompt();
  } else {
    console.error("Failed to load initial data");
  }
};

const createControl = (category) => {
  const control = document.createElement("div");
  control.classList.add("control");
  if (defaultCategories.includes(category)) {
    control.classList.add("active");
  }

  const icon = document.createElement("i");
  icon.classList.add("ph", icons[category] || "ph-question");

  const label = document.createElement("label");
  label.htmlFor = category;
  label.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  label.id = `${category}-label`;

  const select = document.createElement("select");
  select.id = `${category}-select`;
  select.addEventListener("change", () => {
    control.classList.add("active");
    updatePrompt();
  });
  select.disabled = !control.classList.contains("active");
  currentData[category].forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });

  if (defaultCategories.includes(category)) {
    select.disabled = false;
  }

  const randomizeBtn = document.createElement("button");
  randomizeBtn.innerHTML = '<i class="ph ph-shuffle"></i>';
  randomizeBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the control's click event from firing
    randomizeCategory(category);
  });

  control.appendChild(icon);
  control.appendChild(label);
  control.appendChild(select);
  control.appendChild(randomizeBtn);

  control.addEventListener("click", (e) => {
    if (
      e.target.tagName !== "SELECT" &&
      e.target.tagName !== "BUTTON" &&
      e.target.tagName !== "I"
    ) {
      control.classList.toggle("active");
      select.disabled = !control.classList.contains("active");
      updatePrompt();
    }
  });

  // Add ARIA attributes
  control.setAttribute("role", "group");
  control.setAttribute("aria-labelledby", `${category}-label`);
  select.setAttribute("aria-label", `Select ${category}`);
  randomizeBtn.setAttribute("aria-label", `Randomize ${category}`);

  return control;
};

const initializeControls = () => {
  container.innerHTML = "";
  categories.forEach((category) => {
    const control = createControl(category);
    const select = control.querySelector('select');
    
    // Set initial state
    if (defaultCategories.includes(category)) {
      control.classList.add("active");
      select.disabled = false;
    } else {
      control.classList.remove("active");
      select.disabled = true;
    }
    
    container.appendChild(control);
  });
};

const randomizeCategory = (category) => {
  const control = document.getElementById(`${category}-select`).parentElement;
  const select = document.getElementById(`${category}-select`);
  
  // Only randomize if the control is active (not disabled)
  if (control.classList.contains("active")) {
    const options = currentData[category];
    const randomOption = options[Math.floor(Math.random() * options.length)];
    select.value = randomOption;
    updatePrompt();
  }
};

const randomizeAllActive = () => {
  categories.forEach((category) => {
    const control = document.getElementById(`${category}-select`).parentElement;
    if (control.classList.contains("active")) {
      randomizeCategory(category);
    }
  });
};

const updatePrompt = () => {
  const withCommas = ["style", "lighting", "color", "visualFX", "camera", "lens", "film"];
  const promptParts = categories
    .filter((category) => document.getElementById(`${category}-select`).parentElement.classList.contains("active"))
    .map((category) => {
      const select = document.getElementById(`${category}-select`);
      if (category === "clothing") {
        return `wearing ${select.value}`;
      } else if (withCommas.includes(category)) {
        return select.value;
      } else {
        return select.value;
      }
    });

  output.value = promptParts.join(", ");
};

const showToast = () => {
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
};

// Event Listeners
dataSelect.addEventListener("change", async () => {
  const selectedFile = dataSelect.value === "default" ? "./data/data.js" : "./data/data_alt.js";
  const data = await loadData(selectedFile);
  if (data) {
    currentData = data;
    categories = Object.keys(currentData);
    initializeControls();
    updatePrompt();
  } else {
    console.error("Failed to load selected data");
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(output.value);
  showToast();
});

randomizeBtn.addEventListener("click", () => {
  categories.forEach(randomizeCategory);
  updatePrompt();
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".controls, .coming-soon").forEach((element) => {
      element.style.display = "none";
    });

    const category = button.dataset.category;
    if (category === "people") {
      document.querySelector(`.controls[data-category="${category}"]`).style.display = "grid";
    } else {
      document.querySelector(`.coming-soon[data-category="${category}"]`).style.display = "flex";
    }
  });
});

// Initialize
initializeData();