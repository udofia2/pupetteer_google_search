# Google Search Automation API

A web application that automates Google searches using Puppeteer with two methods: manual CAPTCHA solving and 2captcha API integration.

## Features

- Two search methods:
  - Manual CAPTCHA solving (free)
  - 2captcha API integration (paid)
- Simple web interface
- Handles Google's reCAPTCHA
- Returns search results in JSON format

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TypeScript

## Installation

1. Clone the repository:
```bash
git clone https://github.com/udofia2/pupetteer_google_search

cd pupetteer_google_search
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript files:
```bash
npm run build
```

## Project Structure

```
project/
├── src/
│   ├── app.ts                 # Main application file
│   ├── controllers/
│   │   └── searchController.ts
│   └── services/
│       └── searchService.ts
├── public/
│   └── index.html            # Frontend interface
├── package.json
└── tsconfig.json
```

## Usage

1. Start the server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

3. Choose your preferred search method:
   - Manual CAPTCHA: A browser window will open when you need to solve a CAPTCHA
   - 2captcha API: Requires an API key from [2captcha.com](https://2captcha.com)

## API Endpoints

### Manual Search
```http
GET /search/manual?query=your_search_query
```

### API Search
```http
GET /search/api?query=your_search_query&apiKey=your_2captcha_api_key
```

## Response Format

```json
{
  "results": [
    {
      "title": "Result Title",
      "link": "https://result-url.com",
      "description": "Result description..."
    }
  ]
}
```

## Development

1. Run in development mode:
```bash
npm run dev
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Successful search
- 400: Bad request (missing parameters)
- 500: Server error

## Dependencies

- express
- puppeteer
- puppeteer-extra (for 2captcha integration)
- typescript (dev dependency)
- @types/express (dev dependency)
- @types/node (dev dependency)
