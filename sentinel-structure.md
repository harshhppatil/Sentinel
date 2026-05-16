# Sentinel Project Structure

This document outlines the directory and file structure of the Sentinel project.

```
.
├── DESIGN.md
├── LICENSE
├── README.md
├── report.js
├── sentinel-structure.md
├── client/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── README.md
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── api/
│       │   └── axios.jsx
│       ├── assets/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── Spinner.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── pages/
│           ├── Architect.jsx
│           ├── Home.jsx
│           ├── KernelVault.jsx
│           ├── KubeCloud.jsx
│           ├── Login.jsx
│           ├── LogStreamer.jsx
│           ├── Profile.jsx
│           ├── Register.jsx
│           └── SystemPulse.jsx
└── server/
    ├── api-service/
    │   ├── package.json
    │   ├── pnpm-lock.yaml
    │   ├── seed.js
    │   ├── server.js
    │   └── src/
    │       ├── config/
    │       │   └── db.js
    │       ├── kernelvault/
    │       │   ├── snippet.controller.js
    │       │   ├── snippet.model.js
    │       │   └── snippet.routes.js
    │       ├── logstreamer/
    │       │   ├── streamer.controller.js
    │       │   ├── streamer.routes.js
    │       │   └── logs/
    │       ├── middleware/
    │       │   ├── authMiddleware.js
    │       │   └── errorHandler.js
    │       └── systempulse/
    │           ├── pulse.controller.js
    │           ├── pulse.routes.js
    │           └── logs/
    ├── architect-service/
    │   ├── HELP.md
    │   ├── mvnw
    │   ├── mvnw.cmd
    │   ├── pom.xml
    │   ├── src/
    │   │   ├── main/
    │   │   │   ├── java/
    │   │   │   │   └── com/
    │   │   │   │       └── sentinel/
    │   │   │   │           └── architect/
    │   │   │   │               ├── ArchitectServiceApplication.java
    │   │   │   │               ├── config/
    │   │   │   │               └── ...
    │   │   │   └── resources/
    │   │   │       └── application.yaml
    │   │   └── test/
    │   │       └── java/
    │   │           └── com/
    │   │               └── sentinel/
    │   │                   └── architect/
    │   │                       └── ...
    │   └── target/
    │       ├── classes/
    │       │   ├── application.yaml
    │       │   └── com/
    │       │       └── sentinel/
    │       │           └── architect/
    │       │               ├── config/
    │       │               ├── controller/
    │       │               ├── exception/
    │       │               ├── model/
    │       │               └── service/
    │       ├── generated-sources/
    │       │   └── annotations/
    │       ├── generated-test-sources/
    │       │   └── test-annotations/
    │       ├── maven-status/
    │       │   └── maven-compiler-plugin/
    │       │       ├── compile/
    │       │       │   └── default-compile/
    │       │       │       ├── createdFiles.lst
    │       │       │       └── inputFiles.lst
    │       │       └── testCompile/
    │       │           └── default-testCompile/
    │       │               ├── createdFiles.lst
    │       │               └── inputFiles.lst
    │       └── test-classes/
    │           └── com/
    │               └── sentinel/
    │                   └── architect/
    └── auth-service/
        ├── package.json
        ├── pnpm-lock.yaml
        ├── server.js
        └── src/
            ├── config/
            │   └── db.js
            ├── controllers/
            │   └── authController.js
            ├── middleware/
            │   ├── authMiddleware.js
            │   └── errorHandler.js
            ├── models/
            │   └── User.js
            ├── routes/
            │   ├── authRoutes.js
            │   └── userRoutes.js
            └── utils/
                └── generateToken.js
```
