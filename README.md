# AI Auto-Category & Tag Generator

A full-stack application that leverages AI to automatically categorize products, suggest subcategories, generate SEO tags, and recommend sustainability filters.

## Architecture

This project maintains a strict separation of concerns, fulfilling the architectural requirements precisely:
- **Frontend**: Built with React (Vite-based), utilizing dynamic modern CSS (glassmorphism UI) to capture user input, process loading/error states, and present AI results interactively with visually arresting gradients.
- **Controller Layer** (`Backend/controllers/tagController.js`): Maps the API route `POST /generate-tags` to the business logic. It handles HTTP request parsing, error trapping, and database model initialization.
- **Service Layer** (`Backend/services/aiService.js`): Encapsulates all AI interaction. Calls the OpenRouter API (`nvidia/nemotron-3-super-120b-a12b:free`) to enforce a STRICT JSON response according to allowed categories, maintaining isolation from Express request/response logic.
- **Model Layer** (`Backend/models/Product.js`): Encapsulates the Mongoose database structure, ensuring that `product_name`, `description`, complex AI `JSON` outputs, and original `prompt` logs are saved natively.

## Prompt Design

The core of the categorization logic resides in the `services/aiService.js` prompt. It explicitly limits the model's choices for the primary category to a predefined array of allowed categories (e.g., *Kitchen, Personal Care, Packaging, etc.*). Additionally, the prompt uses `response_format` directives (where supported) alongside firm textual instructions to yield absolute JSON lacking any Markdown conversational bloat. The advanced reasoning feature is enabled via the OpenRouter API for logical tag and subcategory extraction.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Local or Cloud MongoDB Database
- OpenRouter API Key

### Running the Backend
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Edit the `.env` file to include your OpenRouter API Key and Mongoose URI:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   MONGODB_URI=mongodb://localhost:27017/ai-tag-generator
   PORT=5000
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### Running the Frontend
1. In a new terminal, navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:5173`
