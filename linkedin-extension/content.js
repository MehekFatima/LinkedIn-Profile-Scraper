// File: content.js

function waitForNetworkIdle(timeout = 10000) {
    return new Promise((resolve) => {
      let timer;
      let pendingRequests = 0;
  
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            pendingRequests++;
            fetch(entry.name, { method: 'HEAD', mode: 'no-cors' })
              .then(() => {
                pendingRequests--;
                if (pendingRequests === 0) {
                  clearTimeout(timer);
                  observer.disconnect();
                  setTimeout(resolve, 1000); // Wait an extra second after network is idle
                }
              })
              .catch(() => {
                pendingRequests--;
              });
          }
        });
      });
  
      observer.observe({ entryTypes: ['resource'] });
  
      timer = setTimeout(() => {
        observer.disconnect();
        resolve();
      }, timeout);
    });
  }
  
  function getTextContentByXPath(xpath) {
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element ? element.textContent.trim() : null;
  }
  
  function scrapeProfileData() {
    const profileData = {};
    const log = {};
  
    // Name
    profileData.name = getTextContentByXPath('//h1[contains(@class, "text-heading-xlarge")]') || 
                       getTextContentByXPath('//h1[@id="ember32"]') || 'N/A';
    log.name = `XPath used: ${profileData.name !== 'N/A' ? '//h1[contains(@class, "text-heading-xlarge")]' : '//h1[@id="ember32"]'}`;
  
    // URL
    profileData.url = window.location.href;
  
    // About
    const aboutXPaths = [
        '//section[contains(@class, "summary")]//div[contains(@class, "inline-show-more-text")]',
        '//section[@data-section="summary"]//div[contains(@class, "inline-show-more-text")]',
        '//*[@id="profile-content"]/div/div[2]/div/div/main/section[3]/div[3]/div/div/div/span[1]',
        '//*[@id="profile-content"]/div/div[2]/div/div/main/section[4]/div[3]/div/div/div'
      ];
      
      for (let xpath of aboutXPaths) {
        let content = getTextContentByXPath(xpath);
        
        // Removing newline characters
        if (content) {
          profileData.about = content.replace(/\n/g, '').trim(); // Remove \n and trim extra spaces
          log.about = `XPath used: ${xpath}`;
          break;
        }
      }
      
      profileData.about = profileData.about || 'N/A';
      
  
    // Bio
    const bioXPaths = [
      '//div[contains(@class, "text-body-medium") and contains(@class, "break-words")]',
      '//h2[contains(@class, "mt1") and contains(@class, "t-18")]'
    ];
    for (let xpath of bioXPaths) {
      profileData.bio = getTextContentByXPath(xpath);
      if (profileData.bio) {
        log.bio = `XPath used: ${xpath}`;
        break;
      }
    }
    profileData.bio = profileData.bio || 'N/A';
  
    // Location
    const locationXPaths = [
      '//span[contains(@class, "text-body-small") and contains(@class, "inline")]',
      '//div[contains(@class, "pv-text-details__left-panel")]//span[contains(@class, "text-body-small")]'
    ];
    for (let xpath of locationXPaths) {
      profileData.location = getTextContentByXPath(xpath);
      if (profileData.location) {
        log.location = `XPath used: ${xpath}`;
        break;
      }
    }
    profileData.location = profileData.location || 'N/A';
    
    // Connection Count
    const connectionXPaths = [
      '//li[contains(., "connection")]',
      '//span[@id="navigation-index-connect-count"]',
      '//*[@id="ember83"]/span',
      '//*[@id="main-content"]/section[1]/div/section/section[1]/div/div[2]/div[1]/h3/div/div[3]/span[2]'
    ];
    for (let xpath of connectionXPaths) {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (element && (element.textContent.includes('connection') || element.getAttribute('aria-label')?.includes('connections'))) {
        profileData.connectionCount = parseInt(element.textContent.replace(/,/g, '').match(/\d+/)[0]) || 0;
        log.connectionCount = `XPath used: ${xpath}`;
        break;
      }
    }
    profileData.connectionCount = profileData.connectionCount || 0;
  
    console.log('Scraped Profile Data:', profileData);
    console.log('Scraping Log:', log);
  
    return profileData;
  }
  
  function retryScrapingUntilFulfilled(maxAttempts = 5, delay = 2000) {
    let attempts = 0;
  
    function attempt() {
      attempts++;
      console.log(`Scraping attempt ${attempts}`);
      const profileData = scrapeProfileData();
  
      if (Object.values(profileData).some(value => value !== 'N/A' && value !== 0) || attempts >= maxAttempts) {
        chrome.runtime.sendMessage({ action: "sendProfileData", data: profileData });
      } else {
        console.log(`Retrying in ${delay}ms...`);
        setTimeout(attempt, delay);
      }
    }
  
    attempt();
  }
  
  // Wait for the page to load and become idle before scraping
  waitForNetworkIdle()
    .then(() => {
      console.log('Page seems to be fully loaded, starting scrape');
      retryScrapingUntilFulfilled();
    })
    .catch((error) => {
      console.error('Error waiting for page to load:', error);
    });
  
  // Listen for manual trigger from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrapeProfile") {
      console.log('Received manual scrape request');
      retryScrapingUntilFulfilled();
    }
  });