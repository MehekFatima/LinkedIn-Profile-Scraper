document.addEventListener('DOMContentLoaded', function() {
    var pickTitleBtn = document.getElementById('scrape-btn');
    
    pickTitleBtn.addEventListener('click', function() {
        const profileLinks = [
            'https://www.linkedin.com/in/mehek-fatima/', 
      
        ];
        
        profileLinks.forEach(link => {
            chrome.tabs.create({ url: link }, function(tab) {
                // No need for timeout; the content script handles data collection.
            });
        });
    });
});
