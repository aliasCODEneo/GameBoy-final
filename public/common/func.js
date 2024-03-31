document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.review-search-input');
    const searchResults = document.querySelector('.review-search-results');

    function fetchGames(searchQuery) {
        fetch('/api/games')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch games');
                }
                return response.json();
            })
            .then(games => {
                const filteredGames = filterGames(games, searchQuery);
                displayResults(filteredGames);
            })
            .catch(error => {
                console.error('Error fetching games:', error);
            });
    }

    function filterGames(games, searchQuery) {
        return games.filter(game => game.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
    }

    function displayResults(results) {
        const resultList = results.map(game => `<li>${game.name}</li>`).join('');
        const html = `<ul>${resultList}<li>Add a game</li></ul>`;
        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    // Event listener for input
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.trim();
        if (searchValue) {
            fetchGames(searchValue); // Fetch games when input is provided
        } else {
            searchResults.style.display = 'none';
        }
    });

    // Event listener for selecting a result or adding a game
    searchResults.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const selectedText = event.target.textContent;
            if (selectedText === 'Add a game') {
                // Redirect to the add game page
                window.location.href = '/review-add-game';
            } else {
                // Redirect to the selected game's profile page
                window.location.href = `/game-profile-login/${selectedText}`;
            }
            searchResults.style.display = 'none';
        }
    });

    // Close search results if user clicks outside the search container
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.review-search-container')) {
            searchResults.style.display = 'none';
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    function toggleDropdown(dropdownId) {
        var dropdown = document.getElementById(dropdownId);
        if (window.getComputedStyle(dropdown).display === 'none') {
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    }

    document.getElementById('discover-button').addEventListener('click', function() {
        toggleDropdown('discover-dropdown');
    });

    document.getElementById('review-button').addEventListener('click', function() {
        toggleDropdown('review-dropdown');
    });

    document.getElementById('profile-button').addEventListener('click', function() {
        toggleDropdown('profile-dropdown');
    });
});

// JavaScript code to capture the rating value
document.addEventListener("DOMContentLoaded", function() {
    const ratingInputs = document.querySelectorAll('.rating-RCR input[type="radio"]');
    const ratingValue = document.getElementById('rating-value');

    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            ratingValue.textContent = this.value;
            document.getElementById('rating-value-input').value = this.value;
        });
    });
});
