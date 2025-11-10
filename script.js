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
    div.classList.add("suggestion-item"); //Show live results as the user types

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
// The renderRecipes() function dynamically builds recipe cards based on the fetched meal data. It first clears any previous results, then loops through the meal array, creating a new <div> element for each one. Each card includes the recipe image, name, category, and a link to view the full recipe. Finally, it appends these cards to the recipe container, updating the DOM in real-time. This makes the interface fully dynamic without reloading the page.

function renderRecipes(meals) {
  //Before showing new search results, it removes the old ones to avoid duplicates.
  recipeContainer.innerHTML = "";
  // meals is an array (from the API).Each meal is an object
  meals.forEach((meal) => {
    const card = document.createElement("div");
    //Creates a brand-new <div> for one recipe card. Adds a CSS class for styling (rounded corners, shadows, etc.).
    card.classList.add("recipe-card");

    // Create the image separately
    const img = document.createElement("img");
    img.dataset.src = meal.strMealThumb;    // store real URL
    img.alt = meal.strMeal;
    //Lazy loading keeps the initial page light and speeds up rendering by loading images only as needed.
    img.loading = "lazy";

      // load image only when visible
      //The observer triggers when an image enters the viewport, not when it finishes loading.
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = img.dataset.src;
          img.onload = () => img.classList.add("loaded");
          obs.unobserve(img);
        }
      });
    });
    observer.observe(img);
    card.appendChild(img);


    // === TITLE ===
    const title = document.createElement("h3");
    title.textContent = meal.strMeal;
    card.appendChild(title);

    // === CATEGORY ===
    const category = document.createElement("p");
    category.textContent = meal.strCategory || "Unknown Category";
    card.appendChild(category);

    // === LINK GROUP ===
    const linkGroup = document.createElement("div");
    linkGroup.classList.add("link-group");

    // Recipe link
    const recipeLink = document.createElement("a");
    recipeLink.href = meal.strSource;
    recipeLink.target = "_blank";
    recipeLink.classList.add("recipe-link");
    recipeLink.innerHTML = `View Recipe <i class="fa-solid fa-up-right-from-square"></i>`;
    linkGroup.appendChild(recipeLink);

    // YouTube link
    if (meal.strYoutube) {
      const youtubeLink = document.createElement("a");
      youtubeLink.href = meal.strYoutube;
      youtubeLink.target = "_blank";
      youtubeLink.classList.add("recipe-link", "secondary-link");
      youtubeLink.innerHTML = `Watch Video <i class="fa-brands fa-youtube"></i>`;
      linkGroup.appendChild(youtubeLink);
    }

    card.appendChild(linkGroup);

    //Finally, adds the new <div> card inside the main container in the DOM. Repeats for every meal in the array
    recipeContainer.appendChild(card);
  });
  }

// 8️ Save search term → localStorage + update UI
function saveRecentSearch(term) {
  if (!term) {
    // console.log("No term provided, exiting function.");
    return;
  }

  let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  // console.log(" Before update:", searches);

  // Remove duplicates
  searches = searches.filter(item => item.toLowerCase() !== term.toLowerCase());
  // console.log(" After removing duplicates:", searches);

  // Add new term at start
  searches.unshift(term);
  // console.log(" After adding new term:", searches);

  // Keep only 5
  if (searches.length > 5) searches.pop();
  console.log(" After trimming:", searches);

  // Save to localStorage
  localStorage.setItem("recentSearches", JSON.stringify(searches));
  // console.log(" Saved to localStorage:", JSON.parse(localStorage.getItem("recentSearches")));

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

// 10 Load saved tags on startup
renderRecentSearches();

/* Simplified Modern Version (commented for future reference)

function saveRecentSearch(term) {
  if (!term?.trim()) return;
  const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  const updated = [term, ...searches.filter(i => i.toLowerCase() !== term.toLowerCase())].slice(0, 5);
  localStorage.setItem("recentSearches", JSON.stringify(updated));
  renderRecentSearches();
}
*/
