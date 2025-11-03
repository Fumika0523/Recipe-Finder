console.log("script.js is connected!");

// 1️Select key elements
const input = document.getElementById("search-input");
const container = document.getElementById("recipe-container");
const suggestions = document.getElementById("suggestions");

// Toggle Dark/Light Mode
const themeBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// 1️ Load previous preference
if (localStorage.getItem("theme") === "dark") {
  document.body.setAttribute("data-theme", "dark");
  themeIcon.classList.replace("fa-moon", "fa-sun");
  themeBtn.innerHTML = '<i id="theme-icon" class="fa-solid fa-sun lightIcon"></i>';
}

// 2️ Handle button click
themeBtn.addEventListener("click", () => {
  const current = document.body.getAttribute("data-theme");

  if (current === "dark") {
    // Switch to light mode
    document.body.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    themeBtn.innerHTML = '<i id="theme-icon" class="fa-solid fa-moon darkIcon"></i> ';
  } else {
    // Switch to dark mode
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeBtn.innerHTML = '<i id="theme-icon" class="fa-solid fa-sun lightIcon"></i>';
  }
});


// 2️ Debounce helper
let timeout;
function debounce(fn, delay) {
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// 3️ Handle key events (debounced)
const handleKeyup = async (e) => {
  const query = input.value.trim();
  console.log("query:", query);

  // Clear suggestions if empty
  if (!query) {
    suggestions.innerHTML = "";
    return;
  }

  // Fetch suggestions if length ≥ 3
  if (query.length >= 3) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();
    showSuggestions(data.meals);
  }

  // Press Enter → full search
  if (e.key === "Enter") {
    searchRecipes(query);
  }
};

// 4️  Attach debounced event listener
input.addEventListener("keyup", debounce(handleKeyup, 300));

// 5️ Show 3–5 suggestions
function showSuggestions(meals) {
  suggestions.innerHTML = "";
  if (!meals) return;

  meals.slice(0, 5).forEach((meal) => {
    const div = document.createElement("div");
    div.textContent = meal.strMeal;
    div.classList.add("suggestion-item");

    div.addEventListener("click", () => {
      input.value = meal.strMeal;
      suggestions.innerHTML = "";
      searchRecipes(meal.strMeal);
    });

    suggestions.appendChild(div);
  });
}

// 6️  Fetch recipes by search term
async function searchRecipes(query) {
  container.innerHTML = "<p>Loading recipes...</p>";

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await res.json();

  if (!data.meals) {
    container.innerHTML = "<p>No recipes found. Try another ingredient!</p>";
    return;
  }

  renderRecipes(data.meals);
}

// 7️ Render recipe cards dynamically
function renderRecipes(meals) {
  container.innerHTML = "";

  meals.forEach((meal) => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
      <h3>${meal.strMeal}</h3>
      <p>${meal.strCategory || "Unknown Category"}</p>
      <a href="${meal.strSource || meal.strYoutube}" 
        target="_blank" 
        class="recipe-link">
        View Recipe <i class="fa-solid fa-up-right-from-square"></i>
      </a>
    `;

    container.appendChild(card);
  });
}
