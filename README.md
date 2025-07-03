# EduMate - AI Study Buddy

EduMate is an AI-powered study assistant that helps users extract text from documents, summarize content, generate quizzes, and ask doubts interactively. It combines document upload, AI summarization, quiz generation, and chat features in a user-friendly interface.

---

## Features

- **Document Upload:** Upload PDF, text, or image files to extract text content.
- **Text Summarization:** Generate concise summaries of the uploaded content.
- **Quiz Generation:** Create multiple-choice quizzes based on the content to test knowledge.
- **Ask Doubt:** Interactively ask questions related to the content and get AI-powered answers.
- **Chat Box:** Engage in a conversational chat interface for study assistance.
- **Modal Input for Doubts:** Improved UX with modal popup for asking doubts.
- **Icon Display:** EduMate icon displayed at the top-left corner for branding.
- **Responsive UI:** Clean and responsive design using Tailwind CSS.

---

## UI Screenshots

<!-- Add UI images here -->

![Upload and Extract Text](path/to/upload-screenshot.png)

![Quiz Generation](path/to/quiz-screenshot.png)

![Ask Doubt Modal](path/to/ask-doubt-modal.png)

![Chat Box](path/to/chat-box.png)

---

## Getting Started

### Prerequisites

- Java 17+
- Maven
- Node.js and npm/yarn

### Backend Setup

1. Navigate to the backend directory.
2. Configure your Gemini API key in `application.properties` or environment variables.
3. Run the Spring Boot application:
   ```
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the `client` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the React development server:
   ```
   npm start
   ```

---

## Usage

1. Upload a document using the file input.
2. Extracted text will appear in the text area.
3. Choose to summarize, generate a quiz, or ask a doubt using the tabs.
4. Interact with the quiz or chat as needed.

---

## Future Enhancements

- User authentication and profile management.
- Quiz history and performance analytics.
- Flashcard generation for quick revision.
- Text-to-speech support.
- Collaborative study features.
- Multi-language support.
- Advanced quiz question types.
- Document annotation and highlighting.

---

## License

MIT License

---

## Contact

For questions or contributions, please contact the project maintainer.
