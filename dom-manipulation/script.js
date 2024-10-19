// Array to hold quote objects
let quotes = [];

// Load quotes from local storage on initialization
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Default quotes if none are found in local storage
        quotes = [
            { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspirational" },
            { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivational" },
            { text: "The purpose of our lives is to be happy.", category: "Philosophical" },
            { text : "The unexamined life is not worth living.", category:"Philosophical"},
            { text: "The best way to predict the future is to create it.", category: "Inspirational" },
            { text: "The only way to do great work is to love what you do.", category: "Motivational" },
            { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Philosophical" },
            { text: "Happiness is not something ready-made. It comes from your own actions.", category: "Philosophical" },
        ];
        
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Clear previous quote display
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear previous content

    // Create new elements
    const quoteText = document.createElement("p");
    quoteText.textContent = `"${quote.text}"`;

    const quoteCategory = document.createElement("p");
    quoteCategory.innerHTML = `<strong>Category:</strong> ${quote.category}`;

    // Append new elements to the display
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);

    // Store the last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to add a new quote
function createAddQuoteForm() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes(); // Save updated quotes to local storage

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        alert("Quote added successfully!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Function to export quotes as JSON
function exportQuotes() {
    const json = JSON.stringify(quotes, null, 2); // Pretty print JSON
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes(); // Save updated quotes to local storage
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}
function filterQuotes() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedCategory = categoryFilter.value;
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear previous content

    if (selectedCategory === "all") {
        quotes.forEach(quote => {
            const quoteText = document.createElement("p");
            quoteText.textContent = `"${quote.text}"`;
            
            const quoteCategory = document.createElement("p");
            quoteCategory.innerHTML = `<strong>Category:</strong> ${quote.category}`;
            
            quoteDisplay.appendChild(quoteText);
            quoteDisplay.appendChild(quoteCategory);
        });
    } else {
        const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        filteredQuotes.forEach(quote => {
            const quoteText = document.createElement("p");
            quoteText.textContent = `"${quote.text}"`;
            
            const quoteCategory = document.createElement("p");
            quoteCategory.innerHTML = `<strong>Category:</strong> ${quote.category}`;
            
            quoteDisplay.appendChild(quoteText);
            quoteDisplay.appendChild(quoteCategory);
        });
    }

    // Save the last selected filter to local storage
    localStorage.setItem('lastSelectedFilter', selectedCategory);
}
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Default quotes if none are found in local storage
        quotes = [
            // ... existing default quotes ...
        ];
    }

    populateCategories();
    const lastSelectedFilter = localStorage.getItem('lastSelectedFilter');
    if (lastSelectedFilter) {
        const categoryFilter = document.getElementById("categoryFilter");
        categoryFilter.value = lastSelectedFilter;
        filterQuotes();
    }
}
function createAddQuoteForm() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes(); // Save updated quotes to local storage
        populateCategories(); // Update categories in dropdown

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        alert("Quote added successfully!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteButton").addEventListener("click", createAddQuoteForm);
document.getElementById("exportButton").addEventListener("click", exportQuotes);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// Load quotes on initialization
loadQuotes();
showRandomQuote();