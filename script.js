// Array to hold quote objects
let quotes = [];
const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Example API URL

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
            { text: "The unexamined life is not worth living.", category: "Philosophical" },
            { text: "The best way to predict the future is to create it.", category: "Inspirational" },
            { text: "The only way to do great work is to love what you do.", category: "Motivational" },
            { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Philosophical" },
            { text: "Happiness is not something ready-made. It comes from your own actions.", category: "Philosophical" },
        ];
    }

    populateCategories();
    const lastSelectedFilter = localStorage.getItem('lastSelectedFilter');
    if (lastSelectedFilter) {
        document.getElementById("categoryFilter").value = lastSelectedFilter;
        filterQuotes();
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear previous content

    const quoteText = document.createElement("p");
    quoteText.textContent = `"${quote.text}"`;

    const quoteCategory = document.createElement("p");
    quoteCategory.innerHTML = `<strong>Category:</strong> ${quote.category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);

    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Add a new quote
function createAddQuoteForm() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        postQuoteToServer(newQuote); // Sync new quote to server

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        alert("Quote added successfully!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Export quotes as JSON
function exportQuotes() {
    const json = JSON.stringify(quotes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    fileReader.read AsText(event.target.files[0]);
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";

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

    localStorage.setItem('lastSelectedFilter', selectedCategory);
}

// Fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Assume the data is in the format we need
        return data.map(item => ({ text: item.title, category: 'Fetched' }));
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return [];
    }
}

// Post quotes to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
        return response.json();
    } catch (error) {
        console.error("Error posting quote:", error);
    }
}

// Sync quotes with the server
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    
    // Check for new quotes and update local storage
    serverQuotes.forEach(serverQuote => {
        const exists = quotes.some(quote => quote.text === serverQuote.text);
        if (!exists) {
            quotes.push(serverQuote);
        }
    });

    // Check for updated quotes and update local storage
    quotes.forEach(localQuote => {
        const serverQuote = serverQuotes.find(q => q.text === localQuote.text);
        if (serverQuote && serverQuote.category !== localQuote.category) {
            localQuote.category = serverQuote.category;
        }
    });

    saveQuotes();
    populateCategories();
    alert("Quotes synced with server!"); // Notification when quotes are synced
}

// Set an interval to sync quotes every 10 seconds
setInterval(syncQuotes, 10000);

loadQuotes();