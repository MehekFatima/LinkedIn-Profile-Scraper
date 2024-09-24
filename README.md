# LinkedIn Profile Scraper

## Description

The LinkedIn Profile Scraper is a Chrome extension that extracts information from LinkedIn profiles and sends it to a Node.js server for storage in a MySQL database. This tool is designed for developers looking to gather profile data efficiently for analytics or other purposes.

## Features

- Scrapes essential data from LinkedIn profiles, including:
  - Name
  - URL
  - About section
  - Bio
  - Location
  - Connection count
- Stores scraped data in a MySQL database.
- Provides a simple API for data submission.

## Technologies Used

- **Frontend**: Chrome Extension (HTML, JavaScript)
- **Backend**: Node.js, Express
- **Database**: MySQL
- **ORM**: Sequelize

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and go to `chrome://extensions/`.
3. Enable Developer mode by toggling the switch in the upper-right corner.
4. Click on the "Load unpacked" button and select the directory where you cloned or downloaded this repository.