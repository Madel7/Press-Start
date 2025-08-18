document.addEventListener('DOMContentLoaded', function() {
    const currentUser = sessionStorage.getItem('currentUser');
    const signSection = document.querySelector('.sign');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        signSection.innerHTML = `
            <img src="imgs/login.png" alt="User" width="30" height="30" />
            <p style="color: white;margin-left: 6px;"> Welcome, ${user.username}!</p>
            <button onclick="logout()" style="background: none; border: none; color: white; cursor: pointer; margin-left: 10px; font-weight: 700; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">Logout</button>
        `;
        
        // if user is admin
        if (user.role === 'admin') {
            document.getElementById('adminControls').style.display = 'block';
            
            // add news form
            document.getElementById('addNewsForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const title = document.getElementById('newsTitle').value.trim();
                const description = document.getElementById('newsDescription').value.trim();
                const imageUrl = document.getElementById('newsImageUrl').value.trim();
                
                if (title && description) {
                    addNewsItem(title, description, imageUrl);
                    this.reset();  
                    displayNews();
                    alert('News added successfully!');
                }
            });
        }
    }
    
    displayNews();
});

function logout() {
    sessionStorage.removeItem('currentUser');
    location.reload();
}

function addNewsItem(title, description, imageUrl) {
    const news = JSON.parse(localStorage.getItem('news')) || [];
    
    const newNewsItem = {
        id: Date.now(),
        title: title,
        description: description,
        imageUrl: imageUrl || 'imgs/0x0.jpg',
        dateAdded: new Date().toLocaleDateString()
    };
    
    news.unshift(newNewsItem);
    localStorage.setItem('news', JSON.stringify(news));
}

function displayNews() {
    const news = JSON.parse(localStorage.getItem('news')) || [];
    const newsContainer = document.getElementById('newsContainer');
    

    if (news.length === 0) {
        newsContainer.innerHTML = '<p class="no-news-message">No news available</p>';
        return;
    }
    
    const currentUser = sessionStorage.getItem('currentUser');
    const user = currentUser ? JSON.parse(currentUser) : null;
    
    newsContainer.innerHTML = news.map(item => `
        <div class="news-card">
            <img src="${item.imageUrl}" alt="${item.title}" class="news-image" onerror="this.src='imgs/default-news.jpg'">
            <h3 class="news-title">${item.title}</h3>
            <p class="news-description">${item.description}</p>
            <small class="news-date">Added on: ${item.dateAdded}</small>
            ${user && user.role === 'admin' ? `<button onclick="deleteNews(${item.id})" class="delete-btn">Delete</button>` : ''}
        </div>
    `).join('');
}

function deleteNews(id) {
    if (confirm('Delete this news?')) {
        let news = JSON.parse(localStorage.getItem('news')) || [];
        news = news.filter(item => item.id !== id);
        localStorage.setItem('news', JSON.stringify(news));
        displayNews();
    }
}


