document.addEventListener('DOMContentLoaded', function() {
    let profilePicEditUserProfile = document.getElementById("profile-pic-edit-user-profile");
    let inputFileEditUserProfile = document.getElementById("file-button-edit-user-profile");

    inputFileEditUserProfile.onchange = function() {
        profilePicEditUserProfile.src = URL.createObjectURL(inputFileEditUserProfile.files[0]);
    };
});

document.addEventListener('DOMContentLoaded', function() {
    let gamePicReviewAddGame = document.getElementById("preview-game-RAG");
    let inputFileReviewAddGame = document.getElementById("file-button-RAG");
    const categoryButtonsList = document.querySelectorAll('.separate-category-buttons-RAG');

    inputFileReviewAddGame.onchange = function() {
        gamePicReviewAddGame.src = URL.createObjectURL(inputFileReviewAddGame.files[0])
    }

    categoryButtonsList.forEach(categoryButton => {
        categoryButton.addEventListener('click', () => {
            document.querySelector('.separate-category-buttons-color-RAG')?.classList.remove('separate-category-buttons-color-RAG')
            categoryButton.classList.add('separate-category-buttons-color-RAG')
        })
    });
});

    function incrementCounter(type) {
    let counterElementId;
    let thumbsUpCounter = 0;
    let heartCounter = 0;
    if (type === 'thumbsUp') {
        thumbsUpCounter = thumbsUpCounter ===  0 ?  1 : thumbsUpCounter -  1;
        counterElementId = 'thumbsUpCount';
    } else if (type === 'heart') {
        heartCounter = heartCounter ===  0 ?  1 : heartCounter -  1;
        counterElementId = 'heartCount';
    }
    const counterElement = document.getElementById(counterElementId);
    counterElement.textContent = thumbsUpCounter || heartCounter; // Update the counter text
    counterElement.parentNode.classList.toggle('liked'); // Toggle the 'liked' class
    }

    function likeComment(button) {
        var counter = button.querySelector('.icon-counter');
        var count = parseInt(counter.textContent);
        if (button.classList.contains('liked')) {
            counter.textContent = count - 1;
            button.classList.remove('liked');
        } else {
            counter.textContent = count + 1;
            button.classList.add('liked');
        }
    }
    
    function heartComment(button) {
        var counter = button.querySelector('.game-profile-icon-counter');
        var count = parseInt(counter.textContent);
        if (button.classList.contains('liked')) {
            counter.textContent = count - 1;
            button.classList.remove('liked');
        } else {
            counter.textContent = count + 1;
            button.classList.add('liked');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.game-profile-star-rating input').forEach((element) => {
        element.addEventListener('change', () => {
            alert(`Rating selected: ${element.value}`);
        });
    });
    });

    //STAR RATING
    function generateStarsHTML(rating) {
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                starsHTML += '<span class="star">&#9733;</span>';
            } else {
                starsHTML += '<span class="star">&#9734;</span>';
            }
        }
        return starsHTML;
    }

        const starsContainers = document.querySelectorAll(".stars");
    
        starsContainers.forEach(starsContainer => {
            const rating = parseInt(starsContainer.getAttribute("data-rating"));
            const starsHTML = generateStarsHTML(rating);
            starsContainer.innerHTML = starsHTML;
    });

    function editComment(button) {
        var commentBox = button.parentElement;
        var commentText = commentBox.querySelector('.game-profile-comment-text');
    
        if (commentText.getAttribute('contentEditable') === 'true') {
        commentText.setAttribute('contentEditable', 'false');
        button.textContent = 'Edit';
        } else {
        commentText.setAttribute('contentEditable', 'true');
        button.textContent = 'Save'; 
        }
    }

    function saveComment(button) {
        var commentBox = button.parentElement.parentElement;
        var commentText = commentBox.querySelector('.game-profile-comment-text');
    
        // Disable editing and change the button text back to "Edit"
        commentText.setAttribute('contentEditable', 'false');
        button.textContent = 'Edit';
    
        // Here you would send the updated comment text to your server
        // This is just a placeholder and will need to be replaced with your actual save logic
        alert('Sending updated comment to the server: ' + commentText.textContent);
    }

    function deleteComment(button) {
        // Get the comment container
        var commentContainer = button.parentElement;
    
        // Remove the comment container from the DOM
        commentContainer.parentNode.removeChild(commentContainer);
    
        // Here you would send the delete request to your server
        // This is just a placeholder and will need to be replaced with your actual delete logic
        alert('Comment deleted!');
    }

    document.addEventListener("DOMContentLoaded", function() {
        let star = document.querySelectorAll('input');
        let showValue = document.querySelector('#rating-value');
        
        for (let i = 0; i < star.length; i++) {
            star[i].addEventListener('click', function() {
                i = this.value;
        
                showValue.innerHTML = i + " out of 5";
            });
        }
    });

document.addEventListener('DOMContentLoaded', function() {
    function toggleDropdowns(dropdownId2) {
            var dropdowns = document.getElementById(dropdownId2);
            if (window.getComputedStyle(dropdowns).display === 'none') {
                dropdowns.style.display = 'block';
            } else {
                dropdowns.style.display = 'none';
            }
        }
    
    document.getElementById('discover-buttons').addEventListener('click', function() {
            toggleDropdowns('discover-dropdowns-without-login');
    });

    document.addEventListener('DOMContentLoaded', function() {
    let items = document.querySelectorAll('.slider .list .item');
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    let thumbnails = document.querySelectorAll('.thumbnail .item');
    
    // config param
    let countItem = items.length;
    let itemActive = 0;
    // event next click
    next.onclick = function(){
        itemActive = itemActive + 1;
        if(itemActive >= countItem){
            itemActive = 0;
        }
        showSlider();
    }
    //event prev click
    prev.onclick = function(){
        itemActive = itemActive - 1;
        if(itemActive < 0){
            itemActive = countItem - 1;
        }
        showSlider();
    }
    // auto run slider
    let refreshInterval = setInterval(() => {
        next.click();
    }, 5000)

    function showSlider(){
        // remove item active old
        let itemActiveOld = document.querySelector('.slider .list .item.active');
        let thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
        itemActiveOld.classList.remove('active');
        thumbnailActiveOld.classList.remove('active');

        // active new item
        items[itemActive].classList.add('active');
        thumbnails[itemActive].classList.add('active');

        // Directly control the visibility of the "View Reviews" button
        const viewReviewsBtn = slider.querySelector(".view-reviews-btn");
        if (items[itemActive].classList.contains("active")) {
            viewReviewsBtn.style.display = "block"; // Show the button if the item is active
        } else {
            viewReviewsBtn.style.display = "none"; // Hide the button otherwise
        }

        // clear auto time run slider
        clearInterval(refreshInterval);
        refreshInterval = setInterval(() => {
            next.click();
        }, 5000)
    }

    // click thumbnail
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            itemActive = index;
            showSlider();
        })
    });
    });

    starsContainers.forEach(starsContainer => {
        const rating = parseInt(starsContainer.getAttribute("data-rating"));
        const starsHTML = generateStarsHTML(rating);
        starsContainer.innerHTML = starsHTML;
    });

    function generateStarsHTML(rating) {
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                starsHTML += '<span class="star">&#9733;</span>';
            } else {
                starsHTML += '<span class="star">&#9734;</span>';
            }
        }
        return starsHTML;
    }
});