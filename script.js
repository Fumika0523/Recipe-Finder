console.log("script.js is connected!");

// 1️ Select key elements
const input = document.getElementById("search-input");
const recipeContainer = document.getElementById("recipe-container");
const suggestions = document.getElementById("suggestions");

//  Toggle Dark/Light Mode
const themeBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

//  Load previous theme preference
if (localStorage.getItem("theme") === "dark") {
  //If a dark theme is saved, it applies it immediately:
  document.body.setAttribute("data-theme", "dark");
  themeIcon.classList.replace("fa-moon", "fa-sun");
  themeBtn.innerHTML = '<i id="theme-icon" class="fa-solid fa-sun lightIcon"></i>';
}

//  Handle toggle click
//I added a click event listener to my theme button, so every time the user clicks it, the theme toggles between dark and light.

//I implemented theme persistence using the data-theme attribute and CSS variables.When the user clicks the toggle button, the app checks the current mode, switches it, updates the icon, and saves the preference in localStorage.On reload, the theme loads instantly from the saved setting — giving a seamless user experience.

themeBtn.addEventListener("click", () => {
  //The app uses a custom HTML attribute called data-theme on the <body> tag:data-theme="dark" → dark mode,(no attribute) → light mode
  const current = document.body.getAttribute("data-theme");

  //I’m reading the data-theme attribute from the <body> tag to find out which theme is currently active
  if (current === "dark") {
    //By removing the attribute, the default light mode styles automatically take effect.
    document.body.removeAttribute("data-theme"); // back to light
    //I store the user’s theme preference in localStorage so it persists between sessions.
    localStorage.setItem("theme", "light");
    //The button’s icon also changes dynamically — when in light mode, it shows a moon to suggest switching to dark. This ensures that when the user refreshes, dark mode stays enabled.
    themeBtn.innerHTML = '<i id="theme-icon" class="fa-solid fa-moon darkIcon"></i>';
  } else {
    document.body.setAttribute("data-theme", "dark");
    //This ensures that when the user refreshes, dark mode stays enabled.
    localStorage.setItem("theme", "dark");
    themeBtn.innerHTML = '<i id="theme-icon" class="fa-solid fa-sun lightIcon"></i>';
  }
});

// 2️ Debounce helper
//We declare it outside the function so it can be reset every time the user types again.
let timeout;
function debounce(fn, delay) {
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
  //Debounce waits for a quiet period before executing, while throttle runs at fixed intervals regardless of typing speed
}

// 3️ Handle key events (debounced)
//ells JavaScript that this function will use await inside (for asynchronous code like fetch()).
const handleKeyup = async (e) => {
  const query = input.value.trim(); //removes extra spaces from the start or end
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
    console.log("data",data)
    showSuggestions(data.meals);
  }

  // Press Enter → full search
  //Which key was pressed
  if (e.key === "Enter") {
    searchRecipes(query);
  }
};

// 4️ Attach debounced event listener
// Every time a key is released inside the input box, call the handleKeyup function — but wait 300 milliseconds after the last keystroke before actually running it.
input.addEventListener("keyup", debounce(handleKeyup, 300));

// 5️ Show 3–5 suggestions
//The showSuggestions() function dynamically renders a short list of possible matches while the user types. It first clears any old suggestions, safely exits if no results exist, then loops through up to 5 meal objects. For each one, it builds a clickable div element. When clicked, it updates the input field, hides the dropdown, and triggers a full search. This creates a responsive and intuitive auto-suggestion experience using pure vanilla JavaScript.”
function showSuggestions(meals) {
  suggestions.innerHTML = "";
  if (!meals) return;
// 0,1,2,3,4 
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

// 6️ Fetch recipes by search term
async function searchRecipes(query) {
  recipeContainer.innerHTML = "<p>Loading recipes...</p>";
//This function is asynchronous because network calls take time.Using await ensures we wait for the API response before continuing
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await res.json();
  //The API response comes as raw text (JSON format). res.json() converts it into a real JavaScript object.
  if (!data.meals) {
    recipeContainer.innerHTML = "<p>No recipes found. Try another ingredient!</p>";
    return;
  }
  renderRecipes(data.meals);
  saveRecentSearch(query); // ✅ store search history
}

// 7️ Render recipe cards dynamically
function renderRecipes(meals) {
  recipeContainer.innerHTML = "";
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

    recipeContainer.appendChild(card);
  });
}

// 8️ Save search term → localStorage + update UI
function saveRecentSearch(term) {
  if (!term) {
    console.log("No term provided, exiting function.");
    return;
  }

  let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  console.log(" Before update:", searches);

  // Remove duplicates
  searches = searches.filter(item => item.toLowerCase() !== term.toLowerCase());
  console.log(" After removing duplicates:", searches);

  // Add new term at start
  searches.unshift(term);
  console.log(" After adding new term:", searches);

  // Keep only 5
  if (searches.length > 5) searches.pop();
  console.log(" After trimming:", searches);

  // Save to localStorage
  localStorage.setItem("recentSearches", JSON.stringify(searches));
  console.log(" Saved to localStorage:", JSON.parse(localStorage.getItem("recentSearches")));

  renderRecentSearches(); //  refresh visible tags
}

// 9️ Render recent search tags
function renderRecentSearches() {
  const recentContainer = document.getElementById("recent-searches");
  const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

  recentContainer.innerHTML = "";

  if (searches.length === 0) {
    recentContainer.innerHTML = "<p style='color:gray; font-size:14px;'>No recent searches yet.</p>";
    return;
  }

  searches.forEach(term => {
    const tag = document.createElement("span");
    tag.textContent = term;
    tag.classList.add("search-tag");

    // Click → re-search
    tag.addEventListener("click", () => {
      input.value = term;
      searchRecipes(term);
    });

    recentContainer.appendChild(tag);
  });
}

// 🔟 Load saved tags on startup
renderRecentSearches();

/*  Simplified Modern Version (commented for future reference)

function saveRecentSearch(term) {
  if (!term?.trim()) return;
  const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  const updated = [term, ...searches.filter(i => i.toLowerCase() !== term.toLowerCase())].slice(0, 5);
  localStorage.setItem("recentSearches", JSON.stringify(updated));
  renderRecentSearches();
}
*/
