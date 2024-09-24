chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendProfileData") {
        const profileData = request.data;

        // Log the scraped data to the console
        console.log("Scraped Profile Data:", profileData);

        // Send this data to your API
        fetch('http://localhost:3000/api/profiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Profile saved:', data);
            sendResponse({ success: true, data });
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({ success: false, error: error.message });
        });

        return true; // Keep the message channel open for sendResponse
    }
});
