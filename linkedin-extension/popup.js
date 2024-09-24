document.addEventListener('DOMContentLoaded', function() {
    var pickTitleBtn = document.getElementById('scrape-btn');
    
    pickTitleBtn.addEventListener('click', function() {
        const profileLinks = [
            'https://in.linkedin.com/in/aaminah-masarrath-63b623271',
            'https://www.linkedin.com/in/mehek-fatima/', 
            'https://in.linkedin.com/in/muskaan-fatima-847503261',  
        ];
        
        profileLinks.forEach(link => {
            chrome.tabs.create({ url: link }, function(tab) {
                // No need for timeout; the content script handles data collection.
            });
        });
    });
});
