# Sofram-Mobil
A mobile-first food delivery SPA built with Vanilla JS. Features custom routing, real-time search, localStorage cart management, and PWA readiness via manifest.json.

🍔 Sofram: Mobile-First Food Delivery App
A responsive, mobile-first food ordering web application built entirely with Vanilla JavaScript, HTML5, and CSS3 . The project demonstrates how to build a Single Page Application (SPA) without external frameworks, featuring dynamic data fetching, a persistent shopping cart, and Progressive Web App (PWA) readiness .

🚀 About the Project
"Sofram" provides users with a seamless, app-like experience directly in the browser. It asynchronously loads restaurant categories and menu items from a local JSON database . The application mimics native mobile app navigation with custom DOM manipulation and features a fully functional shopping cart that persists data using browser storage .

✨ Key Features
📱 Mobile-First UI/UX: Carefully crafted CSS ensuring a flawless, thumb-friendly experience on mobile devices .

⚡ Custom SPA Routing: Implemented custom Vanilla JS view switching logic (showPage, goBack) for instant, reload-free navigation between Home, Categories, Product Details, and Cart .

🛒 Persistent Shopping Cart: Advanced cart logic utilizing localStorage to save user selections, calculate totals in real-time, and handle item quantity updates .

🔍 Real-Time Search: Instant filtering mechanism that searches through product names and descriptions as the user types .

📦 PWA Ready: Includes a manifest.json file and theme colors, laying the foundation for a Progressive Web App that can be installed on a user's home screen .

🔔 Custom Toast Notifications: Custom-built, animated toast notifications for user actions like adding items to the cart or completing a checkout .

🛠️ Technologies Used
Frontend Engine: HTML5, CSS3, Vanilla JavaScript (ES6+) 

Data Management: JSON Data Fetching & Web Storage API (localStorage) 

Architecture: Single Page Application (SPA), Mobile-First Design 

📂 Project Structure
Plaintext
sofram-app/
├── index.html       # Main semantic UI and layout container
├── styles.css       # Mobile-first styles, animations, and toast designs
├── app.js           # Core application logic, routing, and cart management
├── data.json        # Local database acting as the mock API
├── manifest.json    # PWA configuration file
└── README.md        # Project documentation
⚙️ How to Run
Clone the repository to your local machine.

Open the project in VS Code (or your preferred IDE).

Launch the project using a local server extension like Live Server (this is required to fetch data.json without CORS restrictions).

Switch your browser to mobile view (F12 > Device Toolbar) for the intended experience!

👨‍💻 Developer
Servet Can Kılınç
Front-End Software Development Student @ Ege University
