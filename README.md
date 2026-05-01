# 👁️VisionUI

> Automating web prototyping through Multimodal Image Recognition Inference.

![Project Status](https://img.shields.io/badge/Status-In_Development-orange)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-Fast_Builds-purple)
![AI](https://img.shields.io/badge/AI-Hugging_Face-yellow)

## 📖 Overview

**VisionUI** is an intelligent tool designed to help developers, create UI components by converting physical wireframe sketches into digital prototypes. By leveraging Vision-Language Models (VLMs) via the Hugging Face Inference API, this application will allow users to capture hand-drawn UI sketches and convert them into structural HTML/CSS and React components.

<!-- Insert a screenshot later -->
## ✨ Key Features

* **📸 Live Sketch Capture:** Integrated webcam support to instantly snap photos of sketches and wireframes.

* **🧠 Multimodal AI Inference:** Utilizes Hugging Face open-source models to analyze visual layout and structure.

* **⚡ Instant UI Generation:** Dynamically renders the AI-generated JSON schema into live, interactive web components on the screen.

* **🔒 Frontend-Only Architecture:** Built entirely in React, utilizing strict prompt engineering to manage AI outputs without needing a traditional backend.


## 🛠️ Tech Stack
* **Frontend Framework:** React.js (Bootstrapped with Vite)
* **Styling & Animation:** Vanilla CSS / Framer Motion
* **Hardware Integration:** `react-webcam` API
* **Artificial Intelligence:** Hugging Face Inference API (Vision-to-Text)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
~~~bash 
git clone https://github.com/akshatbhj/VisionUI.git

cd VisionUi
~~~

2. **Install Dependencies:**

```bash
npm install
```

3. **Setup environment variable:**

* Create a `.env` file in the root directory. 
* Add your Hugging Face API token.

```bash
VITE_HUGGINGFACE_API_KEY=your_token_here
```
4. **Run the development server:**

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🧑‍💻Developer

Developed as a Final Year B.Tech IT Graduation Project.

*Note: this project is currently in active development.*

