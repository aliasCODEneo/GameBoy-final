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
        let commentBox = button.parentElement;
        let commentText = commentBox.querySelector('.game-profile-comment-text');
    
        if (commentText.getAttribute('contentEditable') === 'true') {
            // If the comment is being edited, change it back to non-editable
            commentText.setAttribute('contentEditable', 'false');
            button.textContent = 'Edit';
            saveComment(button); // Save the comment when transitioning from edit to non-edit
        } else {
            // If the comment is not being edited, make it editable
            commentText.setAttribute('contentEditable', 'true');
            button.textContent = 'Save';
        }
    }
    
    function saveComment(button) {
        let commentBox = button.parentElement.parentElement;
        let commentText = commentBox.querySelector('.game-profile-comment-text');
        let editedContent = commentText.textContent;
        
        // Retrieve the username from the comment box
        let usernameElement = commentBox.querySelector('.game-profile-commenter-name');
        let username = usernameElement.textContent.trim(); // Trim any leading or trailing whitespace

        let gameNameElement = document.querySelector('.game-profile-right h1');
        let gameName = gameNameElement.textContent.trim();

        console.log('Edited Content:', editedContent);
        console.log('Username:', username);
        
    
        fetch('/update-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                editedContent: editedContent
            })
        })
        .then(response => {
            if (response.ok) {
                // If the update is successful, redirect to edit success page
                alert('Changes saved successfully. Click OK to return to the game profile.');
                window.location.href = '/game-profile-login/' + encodeURIComponent(gameName);
            } else {
                throw new Error('Failed to update comment');
            }
        })
        .catch(error => {
            console.error('Error updating comment:', error);
            // Handle the error, show an error message, or redirect to an error page
            alert('Failed to update comment. Please try again.');
        });
    }
    
    function deleteComment(button) {
        // Get the comment container
        var commentContainer = button.parentElement;
    
        // Retrieve the username and edited content from the comment container
        let usernameElement = commentContainer.querySelector('.game-profile-commenter-name');
        let username = usernameElement.textContent.trim();
    
        let editedContentElement = commentContainer.querySelector('.game-profile-comment-text');
        let editedContent = editedContentElement.textContent.trim();
    
        // Here you would send the delete request to your server
        fetch('/delete-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                editedContent: editedContent
            })
        })
        .then(response => {
            if (response.ok) {
                // If the delete request is successful, remove the comment container from the DOM
                commentContainer.parentNode.removeChild(commentContainer);
                alert('Comment deleted!');
            } else {
                throw new Error('Failed to delete comment');
            }
        })
        .catch(error => {
            console.error('Error deleting comment:', error);
            // Handle the error, show an error message, or redirect to an error page
            alert('Failed to delete comment. Please try again.');
        });
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
    function toggleReplyBox(button) {
        const commentBox = button.closest('.game-profile-comment-box');
        const replyBox = commentBox.querySelector('.developer-reply-box');
        
        if (replyBox) {
            replyBox.style.display = replyBox.style.display === 'none' ? 'block' : 'none';
        } else {
            const newReplyBox = document.createElement('div');
            newReplyBox.classList.add('developer-reply-box');
            newReplyBox.innerHTML = `
                <textarea class="reply-textarea" placeholder="Write your reply here"></textarea>
                <button class="submit-reply-button" onclick="submitReply(this)">Submit</button>
            `;
            commentBox.appendChild(newReplyBox);
        }
    }
    
    function submitReply(button) {
        const replyTextarea = button.previousElementSibling;
        const replyContent = replyTextarea.value.trim();
        if (replyContent !== '') {
            // Assuming the reply was successfully submitted, update the UI as needed
            const commentBox = button.closest('.game-profile-comment-box');
            const replyMessage = document.createElement('div');
            replyMessage.textContent = `From the developer: ${replyContent}`;
            replyMessage.classList.add('game-profile-comment-text'); // Add CSS class
            commentBox.appendChild(replyMessage);
            
            // Clear the reply textarea
            replyTextarea.value = '';
        }
        // Prevent the default form submission behavior
        event.preventDefault();
    }

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
