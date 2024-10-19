// Array to hold quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspirational" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivational" },
    { text: "The purpose of our lives is to be happy.", category: "Philosophical" },
    { text : "The unexamined life is not worth living.", category:"Philosophical"},
    { text: "The best way to predict the future is to create it.", category: "Inspirational" },
    { text: "The only way to do great work is to love what you do.", category: "Motivational" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Philosophical" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", category: "Philosophical" },
];

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
}

function createAddQuoteForm() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });

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

// Initial quote display
showRandomQuote();