# ReelScraper 📚

A smart personal organizer for Instagram Reels that helps you save and categorize interesting content you discover. Never lose track of great ideas, places, or resources from your Instagram feed again.

## 🎯 Purpose

Tired of seeing something interesting on Instagram Reels and then forgetting about it? ReelScraper automatically:
- Extracts content from Instagram Reel URLs
- Uses AI to categorize and organize content into topics
- Creates a searchable personal knowledge base
- Helps you build a collection of ideas, places, and resources worth remembering

## ✨ Features

- **Smart Content Extraction**: Automatically pulls reel descriptions using Instagram's API
- **AI-Powered Categorization**: Uses Google Gemini AI to classify content into:
  - Places (restaurants, destinations, locations)
  - Websites (tools, resources, articles)
  - Movies & TV Shows
  - Information & Ideas
  - Tools & Apps
  - Other content types
- **Topic Organization**: Groups related content automatically or creates new topics
- **Web Dashboard**: Beautiful, responsive interface to browse your collection
- **Persistent Storage**: All data stored locally in JSON format
- **Timestamp Tracking**: See when you saved each item
- **Quick Actions**: Direct links to maps for places, external links for websites

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Google Gemini API key

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd reelScraper
npm install
```

2. **Set up environment variables:**
```bash
# Create .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
```

3. **Start the server:**
```bash
npm start
```

4. **Open your browser:**
Navigate to `http://localhost:3000`

## 📖 Usage

### Adding Content

1. **Find an interesting Instagram Reel**
2. **Copy the reel URL**
3. **Send a POST request to add it:**
```bash
curl -X POST http://localhost:3000/reel \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.instagram.com/reel/..."}'
```

The app will automatically:
- Extract the reel description
- Analyze the content with AI
- Categorize it into appropriate topics
- Store it in your collection

### Browsing Your Collection

- Visit `http://localhost:3000` to see your dashboard
- Content is organized by topics (collapsible sections)
- Each entry shows:
  - Title and content type
  - When it was saved
  - Relevant data (links, addresses, etc.)
  - Quick action buttons (maps, external links)

### Viewing All Entries

Access your complete collection via:
```bash
curl http://localhost:3000/entries
```

## 🏗️ Architecture

- **Backend**: Express.js server with ES modules
- **AI Processing**: Google Gemini 2.5 Flash for content classification
- **Storage**: Local JSON database (`db.json`)
- **Frontend**: Vanilla JavaScript with modern CSS
- **API**: RESTful endpoints for content management

## 📁 Project Structure

```
reelScraper/
├── index.js              # Main Express server
├── descriptionHandle.js  # AI processing and database logic
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (API keys)
├── db.json              # Local database (topics and entries)
├── public/
│   └── index.html       # Web dashboard
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Database Structure

The `db.json` file stores:
```json
{
  "topics": ["Travel", "Food", "Tech", "Movies"],
  "entries": [
    {
      "title": "Amazing restaurant in Tokyo",
      "topic": "Food", 
      "type": "place",
      "data": "Sushi Restaurant, Shibuya, Tokyo",
      "url": "https://instagram.com/reel/...",
      "timestamp": 1723456789000
    }
  ]
}
```

## 🤖 AI Classification

The system uses Google Gemini AI to:
- Analyze reel descriptions
- Determine content type (place, website, movie, etc.)
- Match to existing topics or create new ones
- Extract relevant data (addresses, URLs, etc.)

**Content Types Supported:**
- `place` - Restaurants, destinations, locations
- `website` - Tools, resources, articles
- `movie` - Film recommendations
- `tvshow` - TV series suggestions  
- `information` - General knowledge and ideas
- `tool` - Apps and software
- `other` - Miscellaneous content

## 🛠️ Development

### Available Scripts
```bash
npm start      # Start the development server
npm test       # Run tests (placeholder)
```

### API Endpoints

- `POST /reel` - Add a new Instagram Reel URL
- `GET /entries` - Retrieve all organized content
- `GET /` - Serve the web dashboard

### Adding Features

The modular structure makes it easy to extend:
- Add new content types in `descriptionHandle.js`
- Customize the dashboard in `public/index.html`
- Extend the API in `index.js`

## 🔒 Privacy & Security

- All data stored locally on your machine
- No external data sharing
- API keys stored in environment variables
- Instagram content accessed via public oEmbed API

## 🐛 Troubleshooting

**Common Issues:**

1. **"Failed to extract reel description"**
   - Check if the Instagram Reel URL is public
   - Verify the URL format is correct

2. **"AI classification failed"**
   - Ensure your Gemini API key is valid
   - Check your internet connection

3. **"Database errors"**
   - Verify `db.json` has proper JSON format
   - Check file permissions

## 📝 License

ISC License - Feel free to use and modify for personal projects.

## 🤝 Contributing

This is a personal project, but feel free to suggest improvements or report issues!

---

**Built with ❤️ for personal knowledge management**
