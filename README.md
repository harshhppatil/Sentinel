# Sentinel
Sentinel is a distributed, polyglot microservices platform designed for infrastructure orchestration and site reliability monitoring. Built as a capstone project for the Advanced Web Technologies (1CS403) course at RNGPIT, it demonstrates an enterprise-grade integration of the MERN stack and Spring Boot.



Sentinel/
│
├── docker-compose.yml
│
├── client/                          ← React + Vite + Tailwind
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── KernelVault.jsx      ← snippets library
│   │   │   ├── SystemPulse.jsx      ← OS monitor dashboard
│   │   │   ├── LogStreamer.jsx       ← live log terminal
│   │   │   ├── Architect.jsx        ← dockerfile generator
│   │   │   └── KubeCloud.jsx        ← yaml validator (pure React)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   │
│   ├── auth-service/                ← Express + JWT + MongoDB
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── db.js
│   │   │   ├── models/
│   │   │   │   └── User.js
│   │   │   ├── controllers/
│   │   │   │   └── authController.js
│   │   │   ├── routes/
│   │   │   │   └── authRoutes.js
│   │   │   ├── middleware/
│   │   │   │   └── authMiddleware.js
│   │   │   └── utils/
│   │   │       └── generateToken.js
│   │   ├── server.js
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── api-service/                 ← Express + Node.js
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── db.js
│   │   │   ├── kernelvault/
│   │   │   │   ├── snippet.model.js
│   │   │   │   ├── snippet.controller.js
│   │   │   │   └── snippet.routes.js
│   │   │   ├── systempulse/
│   │   │   │   ├── pulse.controller.js
│   │   │   │   └── pulse.routes.js
│   │   │   ├── logstreamer/
│   │   │   │   ├── logs/
│   │   │   │   │   └── server.log   ← simulated log file
│   │   │   │   ├── streamer.controller.js
│   │   │   │   └── streamer.routes.js
│   │   │   └── middleware/
│   │   │       └── authMiddleware.js ← verifies JWT from auth-service
│   │   ├── server.js
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── architect-service/           ← Spring Boot
│       ├── src/main/java/com/sentinel/architect/
│       │   ├── ArchitectApplication.java
│       │   ├── config/
│       │   │   └── CorsConfig.java
│       │   ├── exception/
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   └── ResourceNotFoundException.java
│       │   ├── controller/
│       │   │   └── ArchitectController.java
│       │   ├── service/
│       │   │   └── ArchitectService.java
│       │   └── model/
│       │       ├── GeneratorRequest.java
│       │       └── GeneratorResponse.java
│       ├── src/main/resources/
│       │   └── application.yml
│       ├── Dockerfile
│       └── pom.xml
│
└── README.md