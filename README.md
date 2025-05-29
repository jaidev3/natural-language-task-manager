# 🎯 Natural Language Task Manager

A modern React-based task management application that allows you to create and manage tasks using natural language input. The app supports multiple languages and can parse meeting transcripts to automatically extract tasks.

## ✨ Features

- **Natural Language Processing**: Add tasks using conversational language
- **Multi-language Support**: Works with English, Hindi, and other languages
- **Meeting Transcript Parser**: Extract tasks from meeting transcripts
- **Smart Task Parsing**: Automatically extracts titles, assignees, due dates, and priorities
- **Modern UI**: Clean and intuitive user interface
- **Local Storage**: Tasks and API keys are stored locally in your browser

## 🚀 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **OpenAI API Key** (required for natural language processing)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd natural-language-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🔧 Setup

### OpenAI API Key

This application requires an OpenAI API key to function properly. You'll need to:

1. **Get an OpenAI API key**:

   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to API Keys section
   - Create a new API key

2. **Configure the API key**:
   - The app will prompt you to enter your API key when you first use it
   - Your API key is stored securely in your browser's local storage
   - You can update or delete the API key anytime through the app interface

## 🏃‍♂️ Running the Application

### Development Mode

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Production Build

To build the application for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

### Code Quality

To run the linter:

```bash
npm run lint
```

## 📖 Usage

### Adding Tasks

1. **Configure API Key**: Enter your OpenAI API key in the API Key section
2. **Natural Language Input**: Type tasks in natural language, for example:
   - "Finish landing page Aman by 11pm 20th June"
   - "28th may ko Rajive ko bajar jana hai subha 10 baje Sabji lene"
   - "30 may ko bhandara khane jana hai hanumanji ke mandir me"

### Meeting Transcript Parser

1. Paste meeting transcripts in the dedicated section
2. The app will automatically extract tasks, assignees, and due dates
3. Review and add the parsed tasks to your task list

### Task Management

- **Mark Complete**: Click the checkbox to mark tasks as completed
- **Edit Tasks**: Click on any task to edit its details
- **Delete Tasks**: Use the delete button to remove unwanted tasks
- **View Details**: Tasks show title, assignee, due date, and priority

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features
- **API**: OpenAI GPT for natural language processing
- **Date Handling**: date-fns library
- **Language Processing**: compromise.js
- **Storage**: Browser Local Storage

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ApiKeyManager.tsx    # API key management
│   ├── TaskInput.tsx        # Task input form
│   ├── TaskList.tsx         # Task list display
│   └── MeetingTranscriptParser.tsx  # Meeting parser
├── hooks/              # Custom React hooks
├── services/           # API and business logic
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

1. **API Key Not Working**:

   - Ensure your OpenAI API key is valid and has sufficient credits
   - Check that the key is correctly entered without extra spaces

2. **Tasks Not Parsing**:

   - Verify your internet connection
   - Check if the OpenAI API is accessible
   - Try refreshing the page and re-entering the API key

3. **Development Server Issues**:
   - Make sure you're using Node.js version 16 or higher
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Getting Help

If you encounter any issues or have questions:

- Check the browser console for error messages
- Ensure all prerequisites are met
- Verify your OpenAI API key is working
