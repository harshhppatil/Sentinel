const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

// ── Page dimensions ───────────────────────────────────────────────
const PAGE_W    = 11906;
const PAGE_H    = 16838;
const MARGIN    = 1080;
const CONTENT_W = PAGE_W - 2 * MARGIN; // 9746

// ── Colours ───────────────────────────────────────────────────────
const BLUE  = "1a1a2e";  // dark navy (Sentinel theme)
const ACCENT= "E63946";  // red accent
const LBLUE = "E8E8F0";
const LGRAY = "F5F5F5";
const DGRAY = "444444";
const BLACK = "000000";
const WHITE = "FFFFFF";
const BORDER_COLOR = "CCCCCC";

// ── Border helpers ────────────────────────────────────────────────
const border   = (c = BORDER_COLOR) => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const borders  = (c = BORDER_COLOR) => ({ top: border(c), bottom: border(c), left: border(c), right: border(c) });
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders= { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// ── Read file ─────────────────────────────────────────────────────
const rf = (path) => { try { return fs.readFileSync(path, 'utf8'); } catch { return '// File not found'; } };

// ── Paragraph helpers ─────────────────────────────────────────────
const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 240, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT, space: 4 } },
  children: [new TextRun({ text, bold: true, size: 28, color: BLUE, font: "Arial" })]
});
const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 180, after: 80 },
  children: [new TextRun({ text, bold: true, size: 24, color: BLUE, font: "Arial" })]
});
const h3 = (text) => new Paragraph({
  spacing: { before: 120, after: 60 },
  children: [new TextRun({ text, bold: true, size: 20, color: DGRAY, font: "Arial" })]
});
const body = (text, opts = {}) => new Paragraph({
  spacing: { before: 40, after: 40 },
  children: [new TextRun({ text, size: 20, font: "Arial", color: BLACK, ...opts })]
});
const bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { before: 20, after: 20 },
  children: [new TextRun({ text, size: 20, font: "Arial" })]
});
const sp  = (n=1) => Array(n).fill(0).map(() => new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun("")] }));
const pb  = () => new Paragraph({ children: [new PageBreak()] });

// ── Two-column code block ─────────────────────────────────────────
const codeBlock = (filename, content) => {
  const lines = content.replace(/\t/g, '  ').split('\n');
  const mid   = Math.ceil(lines.length / 2);
  const left  = lines.slice(0, mid);
  const right = lines.slice(mid);
  const colW  = Math.floor(CONTENT_W / 2) - 60;

  const codePara = (line) => new Paragraph({
    spacing: { before: 0, after: 0, line: 220, lineRule: 'exact' },
    children: [new TextRun({ text: line || ' ', font: "Courier New", size: 16, color: "1a1a2e" })]
  });

  const rows = [];
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    rows.push(new TableRow({
      children: [
        new TableCell({
          borders: noBorders, width: { size: colW, type: WidthType.DXA },
          shading: { fill: "FAFAFA", type: ShadingType.CLEAR },
          margins: { top: 0, bottom: 0, left: 80, right: 40 },
          children: [codePara(left[i] || '')]
        }),
        new TableCell({
          borders: { ...noBorders, left: border("DDDDDD") }, width: { size: colW, type: WidthType.DXA },
          shading: { fill: "FAFAFA", type: ShadingType.CLEAR },
          margins: { top: 0, bottom: 0, left: 80, right: 40 },
          children: [codePara(right[i] || '')]
        }),
      ]
    }));
  }

  return [
    new Paragraph({
      spacing: { before: 160, after: 60 },
      border: { top: border(BLUE), bottom: border(BLUE), left: { style: BorderStyle.SINGLE, size: 14, color: ACCENT }, right: border(BLUE) },
      children: [new TextRun({ text: `  ${filename}`, bold: true, size: 18, color: WHITE, font: "Courier New" })],
      shading: { fill: BLUE, type: ShadingType.CLEAR },
    }),
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [colW, colW],
      borders: { top: border("DDDDDD"), bottom: border("DDDDDD"), left: noBorder, right: noBorder, insideH: noBorder, insideV: border("DDDDDD") },
      rows
    }),
    ...sp(1)
  ];
};

// ── Meta table ────────────────────────────────────────────────────
const metaTable = (rows) => {
  const c1 = 2400, c2 = CONTENT_W - 2400;
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [c1, c2],
    rows: rows.map(([f, v], i) => new TableRow({ children: [
      new TableCell({ borders: borders(), width: { size: c1, type: WidthType.DXA },
        shading: { fill: i === 0 ? BLUE : LBLUE, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: f, bold: true, size: 18, font: "Arial", color: i === 0 ? WHITE : BLUE })] })]
      }),
      new TableCell({ borders: borders(), width: { size: c2, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: v, size: 18, font: "Arial", bold: i === 0 })] })]
      }),
    ]}))
  });
};

// ── API table ─────────────────────────────────────────────────────
const apiTable = (rows) => {
  const widths = [2600, 1200, 1600, CONTENT_W - 2600 - 1200 - 1600];
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths,
    rows: rows.map((cells, i) => new TableRow({ children: cells.map((text, j) =>
      new TableCell({ borders: borders(), width: { size: widths[j], type: WidthType.DXA },
        shading: { fill: i === 0 ? BLUE : (i%2===0 ? "FFFFFF" : LGRAY), type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text, size: 16, font: "Courier New", bold: i===0, color: i===0 ? WHITE : BLACK })] })]
      })
    )}))
  });
};

// ── Tech table ────────────────────────────────────────────────────
const techTable = (rows) => {
  const widths = [1800, 3000, CONTENT_W - 1800 - 3000];
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths,
    rows: rows.map((cells, i) => new TableRow({ children: cells.map((text, j) =>
      new TableCell({ borders: borders(), width: { size: widths[j], type: WidthType.DXA },
        shading: { fill: i===0 ? BLUE : (i%2===0 ? "FFFFFF" : LGRAY), type: ShadingType.CLEAR },
        margins: { top: 70, bottom: 70, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text, size: 18, font: "Arial", bold: i===0, color: i===0 ? WHITE : BLACK })] })]
      })
    )}))
  });
};

// ── Screenshot placeholder ────────────────────────────────────────
const screenshot = (title) => [
  h3(title),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: borders("AAAAAA"), width: { size: CONTENT_W, type: WidthType.DXA },
      margins: { top: 200, bottom: 200, left: 200, right: 200 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `[ Screenshot: ${title} ]`, size: 18, color: "AAAAAA", font: "Arial", italics: true })]
      })]
    })]})]}),
  ...sp(1)
];

// ── Source files ──────────────────────────────────────────────────
const BASE  = '/home/claude/sentinel/server';

// Auth-service (reconstructed from conversation)
const authFiles = {
  'auth-service/server.js': `import express      from 'express'
import cors         from 'cors'
import cookieParser from 'cookie-parser'
import helmet       from 'helmet'
import morgan       from 'morgan'
import dotenv       from 'dotenv'
import { connectDB }   from './src/config/db.js'
import authRoutes      from './src/routes/authRoutes.js'
import userRoutes      from './src/routes/userRoutes.js'
import { errorHandler, notFound } from './src/middleware/errorHandler.js'

dotenv.config()
const app  = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(helmet())
app.use(morgan('dev'))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth',  authRoutes)
app.use('/api/users', userRoutes)

app.get('/api/health', (req, res) => {
  res.json({ service: 'sentinel-auth', status: 'running', port: PORT })
})

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(\`Auth Service running on http://localhost:\${PORT}\`))`,

  'auth-service/src/config/db.js': `import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(\`MongoDB connected: \${conn.connection.host}\`)
  } catch (error) {
    console.error(\`MongoDB Error: \${error.message}\`)
    process.exit(1)
  }
}`,

  'auth-service/src/models/User.js': `import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:     { type: String, required: [true, 'Name is required'], trim: true },
  email:    { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  avatar:   { type: String, default: '' },
}, { timestamps: true })

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User`,

  'auth-service/src/controllers/authController.js': `import User from '../models/User.js'
import { generateToken, clearToken } from '../utils/generateToken.js'
import { validationResult } from 'express-validator'

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'User already exists' })

    const user = await User.create({ name, email, password })
    generateToken(res, user._id)
    res.status(201).json({ _id: user._id, name: user.name, email: user.email })
  } catch (error) { next(error) }
}

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    generateToken(res, user._id)
    res.json({ _id: user._id, name: user.name, email: user.email })
  } catch (error) { next(error) }
}

export const logout = (req, res) => {
  clearToken(res)
  res.json({ message: 'Logged out successfully' })
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) { next(error) }
}`,

  'auth-service/src/utils/generateToken.js': `import jwt from 'jsonwebtoken'

export const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
  res.cookie('jwt', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  })
  return token
}

export const clearToken = (res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) })
}`,

  'auth-service/src/routes/authRoutes.js': `import express from 'express'
import { register, login, logout, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { body } from 'express-validator'

const router = express.Router()

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
]
const loginValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
]

router.post('/register', registerValidation, register)
router.post('/login',    loginValidation,    login)
router.post('/logout',   logout)
router.get('/me',        protect,            getMe)

export default router`,

  'auth-service/src/routes/userRoutes.js': `import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import User from '../models/User.js'

const router = express.Router()

router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) { next(error) }
})

export default router`,

  'auth-service/src/middleware/authMiddleware.js': `import jwt  from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ message: 'User not found' })
    next()
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' })
  }
}`,

  'auth-service/src/middleware/errorHandler.js': `export const notFound = (req, res, next) => {
  const error = new Error(\`Route not found: \${req.originalUrl}\`)
  res.status(404)
  next(error)
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}`,
};

// API-service files
const apiFiles = {
  'api-service/server.js':             rf(`${BASE}/api-service/server.js`),
  'api-service/src/config/db.js':      rf(`${BASE}/api-service/src/config/db.js`),
  'api-service/src/middleware/authMiddleware.js': rf(`${BASE}/api-service/src/middleware/authMiddleware.js`),
  'api-service/src/middleware/errorHandler.js':  rf(`${BASE}/api-service/src/middleware/errorHandler.js`),
  'api-service/kernelvault/snippet.model.js':    rf(`${BASE}/api-service/src/kernelvault/snippet.model.js`),
  'api-service/kernelvault/snippet.controller.js': rf(`${BASE}/api-service/src/kernelvault/snippet.controller.js`),
  'api-service/kernelvault/snippet.routes.js':   rf(`${BASE}/api-service/src/kernelvault/snippet.routes.js`),
  'api-service/systempulse/pulse.controller.js': rf(`${BASE}/api-service/src/systempulse/pulse.controller.js`),
  'api-service/systempulse/pulse.routes.js':     rf(`${BASE}/api-service/src/systempulse/pulse.routes.js`),
  'api-service/logstreamer/streamer.controller.js': rf(`${BASE}/api-service/src/logstreamer/streamer.controller.js`),
  'api-service/logstreamer/streamer.routes.js':  rf(`${BASE}/api-service/src/logstreamer/streamer.routes.js`),
  'api-service/seed.js':               rf(`${BASE}/api-service/seed.js`),
};

// Architect-service Java files
const archFiles = {
  'architect-service/pom.xml':                   rf(`${BASE}/architect-service/pom.xml`),
  'architect-service/application.yaml':          `server:\n  port: 8080\n\nspring:\n  application:\n    name: sentinel-architect\n\nlogging:\n  level:\n    org.springframework: INFO\n    com.sentinel: DEBUG`,
  'architect-service/ArchitectApplication.java': `package com.sentinel.architect;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class ArchitectApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(ArchitectApplication.class, args);\n    }\n}`,
  'architect-service/config/CorsConfig.java':    rf(`${BASE}/architect-service/src/main/java/com/sentinel/architect/config/CorsConfig.java`),
  'architect-service/exception/ResourceNotFoundException.java': rf(`${BASE}/architect-service/src/main/java/com/sentinel/architect/exception/ResourceNotFoundException.java`),
  'architect-service/exception/GlobalExceptionHandler.java': rf(`${BASE}/architect-service/src/main/java/com/sentinel/architect/exception/GlobalExceptionHandler.java`),
  'architect-service/model/GeneratorRequest.java': rf(`${BASE}/architect-service/src/main/java/com/sentinel/architect/model/GeneratorRequest.java`),
  'architect-service/model/GeneratorResponse.java': rf(`${BASE}/architect-service/src/main/java/com/sentinel/architect/model/GeneratorResponse.java`),
  'architect-service/service/ArchitectService.java': rf(`${BASE}/architect-service/src/main/java/com/sentinel/architect/service/ArchitectService.java`),
  'architect-service/controller/ArchitectController.java': rf(`${BASE}/architect-service/src/main/java/com/sentinel/architect/controller/ArchitectController.java`),
};

// ── BUILD DOCUMENT ────────────────────────────────────────────────
const children = [];

// ── COVER ─────────────────────────────────────────────────────────
children.push(
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: "R. N. G. Patel Institute of Technology \u2013 RNGPIT", bold: true, size: 24, font: "Arial", color: BLUE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 },
    children: [new TextRun({ text: "Advanced Web Technologies (1CS403) | Semester IV | AY 2025\u20132026", size: 20, font: "Arial", color: DGRAY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
    children: [new TextRun({ text: "AWT PROJECT REPORT", bold: true, size: 40, font: "Arial", color: BLUE })] }),
  ...sp(1),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: "Sentinel", bold: true, size: 48, font: "Arial", color: BLUE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: "A DevOps Intelligence Platform \u2014 Microservices Architecture with Node.js, Express.js, MongoDB and Spring Boot", italics: true, size: 22, font: "Arial", color: DGRAY })] }),
  ...sp(1),
  metaTable([
    ["Field",          "Details"],
    ["Institute",      "R. N. G. Patel Institute of Technology \u2013 RNGPIT, Bardoli"],
    ["Program",        "B.E. Computer Science and Engineering"],
    ["Subject",        "Advanced Web Technologies (1CS403)"],
    ["Semester",       "IV"],
    ["Academic Year",  "2025\u20132026"],
    ["Project Title",  "Sentinel \u2013 DevOps Intelligence Platform"],
    ["Tech Stack",     "Node.js, Express.js, MongoDB, Spring Boot (Java 26), React.js, JWT, Vite"],
    ["Architecture",   "Microservices \u2014 3 independent services (auth, api, architect)"],
  ]),
  pb()
);

// ── 1. AIM ────────────────────────────────────────────────────────
children.push(
  h1("1. Aim"),
  body("To design and develop a full-stack DevOps intelligence web platform named \u201CSentinel\u201D using a microservices architecture. The platform integrates three independent backend services \u2014 an authentication service (Node.js + Express.js + JWT), a core API service (Node.js + Express.js + MongoDB), and a container generator service (Spring Boot + Java 26) \u2014 with a React.js frontend. The project demonstrates real-world application of microservices design, RESTful API development, MongoDB aggregation pipelines, Node.js built-in modules (os, fs), Server-Sent Events (SSE), and Spring Boot dependency injection and exception handling."),
  ...sp(1)
);

// ── 2. OBJECTIVES ─────────────────────────────────────────────────
children.push(
  h1("2. Objectives"),
  bullet("Design and implement a microservices architecture with three independently deployable services."),
  bullet("Implement JWT-based authentication (auth-service) with httpOnly cookie storage and express-validator."),
  bullet("Build Kernel Vault: a searchable MongoDB snippet library using aggregation pipelines ($unwind, $group, $sort, $project)."),
  bullet("Build System Pulse: real-time OS health monitoring using Node.js built-in os module (CPU, memory, network, uptime)."),
  bullet("Build Log Streamer: live server log streaming using Node.js fs module, Streams, fs.watch, and Server-Sent Events (SSE)."),
  bullet("Build Architect: a stateless Dockerfile and docker-compose generator using Spring Boot REST API with dependency injection."),
  bullet("Demonstrate Spring Boot concepts: @RestController, @Service, @Configuration, @Valid, @RestControllerAdvice, constructor DI."),
  bullet("Build a KubeCloud YAML validator as a pure React feature using the js-yaml library."),
  bullet("Apply MongoDB text indexing and compound indexing for efficient full-text and tag-based search."),
  bullet("Secure all tool pages using React ProtectedRoute with JWT-based AuthContext."),
  ...sp(1)
);

// ── 3. THEORY ─────────────────────────────────────────────────────
children.push(
  h1("3. Theory"),

  h2("3.1 Microservices Architecture (Unit 6)"),
  body("Microservices is an architectural style where an application is built as a collection of small, independent services, each responsible for a specific business capability and communicating over well-defined APIs. In Sentinel, three microservices are deployed independently: auth-service handles all authentication concerns, api-service handles the three DevOps tool APIs, and architect-service handles Dockerfile generation using Spring Boot. This mirrors the Unit 6 syllabus reference to \u201CSpring Boot Microservices\u201D."),

  h2("3.2 Node.js Built-in Modules (Unit 2)"),
  body("Node.js ships with a set of built-in core modules that require no installation. In Sentinel, two key modules are used: the os module provides operating system-related utility methods including cpu(), totalmem(), freemem(), uptime(), hostname(), networkInterfaces() and platform() \u2014 all used in System Pulse. The fs (File System) module provides file I/O operations including createReadStream(), appendFileSync(), readFileSync(), and fs.watch() \u2014 all used in Log Streamer."),

  h2("3.3 Streams and Server-Sent Events (Unit 2)"),
  body("Node.js Streams are objects that let you read data from a source or write data to a destination continuously. In Log Streamer, fs.createReadStream() reads the log file as a readable stream, emitting data events for each chunk. Server-Sent Events (SSE) is a server-push technology where the server pushes updates to the browser over a single persistent HTTP connection using text/event-stream content type. The browser\u2019s EventSource API receives these events in real time without polling."),

  h2("3.4 MongoDB Aggregation Pipeline (Unit 4)"),
  body("MongoDB\u2019s aggregation framework processes data records through a pipeline of stages. In Kernel Vault, four stages are used: $unwind deconstructs the tags array field so each tag becomes a separate document; $group groups documents by a specified field and computes aggregate values (count, sum); $sort sorts documents by a field; $project shapes the output document by including/excluding fields. This enables tag statistics, category breakdowns, and usage-sorted queries that are impossible with simple find() operations."),

  h2("3.5 Spring Boot RESTful Services (Unit 6)"),
  body("Spring Boot is an opinionated framework built on the Spring ecosystem that simplifies bootstrapping Java applications. @SpringBootApplication auto-configures the application context, component scanning, and embedded Tomcat server. @RestController combines @Controller and @ResponseBody. @Service marks business logic beans for Spring DI. Constructor injection (preferred over @Autowired field injection) makes dependencies explicit and testable. @Valid triggers validation annotations on request body models. @RestControllerAdvice provides centralized exception handling across all controllers."),

  h2("3.6 JWT Authentication (Unit 3)"),
  body("JSON Web Tokens (JWT) are used in auth-service to authenticate users across all microservices. On login, a signed JWT is generated using jsonwebtoken and stored in an httpOnly cookie. The api-service shares the same JWT_SECRET environment variable and verifies the token in its own authMiddleware. This allows the two Node.js services to authenticate users without a shared session store \u2014 a true stateless microservice pattern."),

  ...sp(1)
);

// ── 4. SYSTEM ARCHITECTURE ────────────────────────────────────────
children.push(
  h1("4. System Architecture"),
  body("Sentinel uses a three-service microservices architecture:"),
  bullet("auth-service (port 5000) \u2014 Node.js + Express.js + MongoDB: Handles register, login, logout, JWT cookie management"),
  bullet("api-service (port 5001) \u2014 Node.js + Express.js + MongoDB: Kernel Vault, System Pulse, Log Streamer"),
  bullet("architect-service (port 8080) \u2014 Spring Boot + Java 26: Stateless Dockerfile/docker-compose generator"),
  bullet("client (port 5173) \u2014 React.js + Vite: Single-page application consuming all three services"),
  ...sp(1),
  body("Vite Proxy Configuration:", { bold: true }),
  body("The Vite development server proxies API calls so the React frontend talks to a single origin, eliminating CORS issues:"),
  body("/auth-api/* \u2192 http://localhost:5000 (auth-service)"),
  body("/api/*      \u2192 http://localhost:5001 (api-service)"),
  body("/architect-api/* \u2192 http://localhost:8080 (architect-service)"),
  ...sp(1)
);

// ── 5. TECHNOLOGIES ───────────────────────────────────────────────
children.push(
  h1("5. Technologies and Tools Used"),
  techTable([
    ["Technology",        "Version / Package",                      "Service / Purpose"],
    ["Node.js",           "v20 LTS",                                "auth-service + api-service runtime"],
    ["Express.js",        "v5.2.1",                                 "REST API framework"],
    ["MongoDB",           "v7.x",                                   "NoSQL database for users + snippets"],
    ["Mongoose",          "v9.4.1",                                 "ODM: schema, validation, queries"],
    ["jsonwebtoken",      "v9.0.3",                                 "JWT generation and verification"],
    ["bcryptjs",          "v3.0.3",                                 "Password hashing (12 salt rounds)"],
    ["express-validator", "v7.3.2",                                 "Request body validation middleware"],
    ["cookie-parser",     "v1.4.7",                                 "Parse httpOnly JWT cookies"],
    ["helmet",            "v8.1.0",                                 "HTTP security headers"],
    ["morgan",            "v1.10.1",                                "HTTP request logging to file + console"],
    ["Spring Boot",       "v3.5.0",                                 "architect-service REST framework"],
    ["Java",              "26 (OpenJDK)",                           "Spring Boot language"],
    ["Maven",             "v3.9.6 (mvnw wrapper)",                  "Java build tool"],
    ["Spring Validation", "spring-boot-starter-validation",         "Java bean validation (@Valid, @NotBlank)"],
    ["React.js",          "v19.2.4",                                "Frontend SPA library"],
    ["React Router",      "v7.14.0",                                "Client-side routing + ProtectedRoute"],
    ["Axios",             "v1.15.0",                                "HTTP client with withCredentials"],
    ["js-yaml",           "npm package",                            "KubeCloud YAML validation (pure React)"],
    ["Tailwind CSS",      "v4.2.2",                                 "Utility-first CSS"],
    ["Vite",              "v8.0.4",                                 "Build tool + dev proxy"],
    ["pnpm",              "v10.33.0",                               "Fast package manager"],
    ["VS Code",           "Latest",                                 "IDE with Java Extension Pack"],
    ["MongoDB Compass",   "Latest",                                 "MongoDB GUI client"],
    ["Postman",           "Latest",                                 "API testing and documentation"],
  ]),
  ...sp(1)
);

// ── 6. FEATURES ──────────────────────────────────────────────────
children.push(
  h1("6. Features and Modules"),

  h2("6.1 Authentication (auth-service)"),
  bullet("POST /api/auth/register \u2014 Register with name, email, password validation"),
  bullet("POST /api/auth/login \u2014 Authenticate, issue JWT httpOnly cookie"),
  bullet("POST /api/auth/logout \u2014 Clear JWT cookie"),
  bullet("GET /api/auth/me \u2014 Get current user from JWT (protected)"),

  h2("6.2 Kernel Vault (api-service)"),
  bullet("GET /api/snippets \u2014 All snippets with text search, category/tag filter, sort by newest/popular/az"),
  bullet("GET /api/snippets/tags \u2014 Aggregation: unique tags with usage count ($unwind + $group)"),
  bullet("GET /api/snippets/stats \u2014 Aggregation: by category, by difficulty, top 5 most copied"),
  bullet("GET /api/snippets/:id \u2014 Single snippet"),
  bullet("POST /api/snippets \u2014 Create snippet (protected)"),
  bullet("PUT /api/snippets/:id \u2014 Update snippet (protected)"),
  bullet("PUT /api/snippets/:id/copy \u2014 Atomic $inc on usageCount (public)"),
  bullet("DELETE /api/snippets/:id \u2014 Delete snippet (protected)"),

  h2("6.3 System Pulse (api-service)"),
  bullet("GET /api/pulse \u2014 Full OS stats: CPU model/cores/usage%, memory (total/used/free/%), network interfaces, load average, uptime, Node.js process stats"),
  bullet("GET /api/pulse/quick \u2014 Quick status: platform, uptime, memory%, CPU cores"),

  h2("6.4 Log Streamer (api-service)"),
  bullet("GET /api/logs/stream \u2014 SSE endpoint: streams existing log file via ReadStream, then watches for new entries via fs.watch"),
  bullet("GET /api/logs/history \u2014 Last N lines from server.log using readFileSync"),
  bullet("POST /api/logs/simulate \u2014 Appends a random/custom log entry via appendFileSync (triggers SSE)"),
  body("Real logs: Morgan is configured to write actual HTTP request logs to server.log simultaneously with console output."),

  h2("6.5 Architect (architect-service \u2013 Spring Boot)"),
  bullet("GET /api/architect/health \u2014 Service health check"),
  bullet("GET /api/architect/options \u2014 Returns supported languages, databases, package managers"),
  bullet("POST /api/architect/generate \u2014 Generates Dockerfile + docker-compose.yml based on language, database, port"),
  body("Supports: Node.js (npm/yarn/pnpm), Python, Go (multi-stage), Java/Spring Boot (multi-stage). Databases: MongoDB, PostgreSQL, MySQL, None. Includes contextual best-practice tips per language/DB combination."),

  h2("6.6 KubeCloud (Pure React \u2013 no backend)"),
  bullet("YAML/JSON paste area with syntax validation using js-yaml library"),
  bullet("Prettify button for auto-formatting and indentation"),
  bullet("Real-time error display with line/column information"),

  ...sp(1)
);

// ── 7. DATABASE DESIGN ────────────────────────────────────────────
children.push(
  h1("7. Database Design (MongoDB Collections)"),

  h2("7.1 Users Collection (auth-service)"),
  body("Fields: _id, name, email, password (hashed, select:false), avatar, timestamps. Password hashed with bcrypt (12 rounds) via pre-save hook. comparePassword() instance method for login verification."),

  h2("7.2 Snippets Collection (api-service)"),
  body("Fields: _id, title, command, description, category (enum: linux/docker/kubernetes/networking/security/monitoring), difficulty (enum: beginner/intermediate/advanced), tags ([String]), usageCount (Number, default 0), isFavorite (Boolean), timestamps."),
  body("Indexes: Text index on (title, description, command) for $text search. Regular indexes on category and tags for filtered queries. Seeded with 17 real DevOps snippets across all 6 categories."),

  ...sp(1)
);

// ── 8. API SUMMARY ────────────────────────────────────────────────
children.push(
  h1("8. REST API Endpoints Summary"),
  apiTable([
    ["Endpoint",                        "Method", "Access",    "Description"],
    // Auth
    ["/api/auth/register",              "POST",   "Public",    "Register user"],
    ["/api/auth/login",                 "POST",   "Public",    "Login + JWT cookie"],
    ["/api/auth/logout",                "POST",   "Public",    "Logout + clear cookie"],
    ["/api/auth/me",                    "GET",    "Protected", "Current user"],
    // Snippets
    ["/api/snippets",                   "GET",    "Public",    "All snippets (search/filter/sort)"],
    ["/api/snippets/tags",              "GET",    "Public",    "Tag aggregation"],
    ["/api/snippets/stats",             "GET",    "Public",    "Category/difficulty stats"],
    ["/api/snippets/:id",               "GET",    "Public",    "Single snippet"],
    ["/api/snippets/:id/copy",          "PUT",    "Public",    "Increment usageCount"],
    ["/api/snippets",                   "POST",   "Protected", "Create snippet"],
    ["/api/snippets/:id",               "PUT",    "Protected", "Update snippet"],
    ["/api/snippets/:id",               "DELETE", "Protected", "Delete snippet"],
    // Pulse
    ["/api/pulse",                      "GET",    "Public",    "Full OS stats (os module)"],
    ["/api/pulse/quick",                "GET",    "Public",    "Quick status"],
    // Logs
    ["/api/logs/stream",                "GET",    "Public",    "SSE live log stream"],
    ["/api/logs/history",               "GET",    "Public",    "Last N log lines"],
    ["/api/logs/simulate",              "POST",   "Public",    "Add fake log entry"],
    // Architect
    ["/api/architect/health",           "GET",    "Public",    "Spring Boot health check"],
    ["/api/architect/options",          "GET",    "Public",    "Supported languages/DBs"],
    ["/api/architect/generate",         "POST",   "Public",    "Generate Dockerfile + compose"],
  ]),
  ...sp(1),
  pb()
);

// ── 9. FILE STRUCTURE ─────────────────────────────────────────────
children.push(
  h1("9. Project File Structure"),
  ...codeBlock('Sentinel/ (server folder structure)',
`server/
\u251C\u2500\u2500 auth-service/               \u2190 Node.js + Express + JWT
\u2502   \u251C\u2500\u2500 server.js
\u2502   \u2514\u2500\u2500 src/
\u2502       \u251C\u2500\u2500 config/db.js
\u2502       \u251C\u2500\u2500 controllers/authController.js
\u2502       \u251C\u2500\u2500 middleware/authMiddleware.js
\u2502       \u251C\u2500\u2500 middleware/errorHandler.js
\u2502       \u251C\u2500\u2500 models/User.js
\u2502       \u251C\u2500\u2500 routes/authRoutes.js
\u2502       \u251C\u2500\u2500 routes/userRoutes.js
\u2502       \u2514\u2500\u2500 utils/generateToken.js
\u251C\u2500\u2500 api-service/                \u2190 Node.js + Express + MongoDB
\u2502   \u251C\u2500\u2500 server.js
\u2502   \u251C\u2500\u2500 seed.js
\u2502   \u2514\u2500\u2500 src/
\u2502       \u251C\u2500\u2500 config/db.js
\u2502       \u251C\u2500\u2500 middleware/authMiddleware.js
\u2502       \u251C\u2500\u2500 middleware/errorHandler.js
\u2502       \u251C\u2500\u2500 kernelvault/
\u2502       \u2502   \u251C\u2500\u2500 snippet.model.js
\u2502       \u2502   \u251C\u2500\u2500 snippet.controller.js
\u2502       \u2502   \u2514\u2500\u2500 snippet.routes.js
\u2502       \u251C\u2500\u2500 systempulse/
\u2502       \u2502   \u251C\u2500\u2500 pulse.controller.js
\u2502       \u2502   \u2514\u2500\u2500 pulse.routes.js
\u2502       \u2514\u2500\u2500 logstreamer/
\u2502           \u251C\u2500\u2500 logs/server.log
\u2502           \u251C\u2500\u2500 streamer.controller.js
\u2502           \u2514\u2500\u2500 streamer.routes.js
\u2514\u2500\u2500 architect-service/          \u2190 Spring Boot + Java 26
    \u251C\u2500\u2500 pom.xml
    \u251C\u2500\u2500 mvnw / mvnw.cmd
    \u2514\u2500\u2500 src/main/
        \u251C\u2500\u2500 resources/application.yaml
        \u2514\u2500\u2500 java/com/sentinel/architect/
            \u251C\u2500\u2500 ArchitectApplication.java
            \u251C\u2500\u2500 config/CorsConfig.java
            \u251C\u2500\u2500 controller/ArchitectController.java
            \u251C\u2500\u2500 exception/GlobalExceptionHandler.java
            \u251C\u2500\u2500 exception/ResourceNotFoundException.java
            \u251C\u2500\u2500 model/GeneratorRequest.java
            \u251C\u2500\u2500 model/GeneratorResponse.java
            \u2514\u2500\u2500 service/ArchitectService.java`),
  pb()
);

// ── 10. SOURCE CODE ───────────────────────────────────────────────
children.push(h1("10. Source Code"));

children.push(h2("10.1 auth-service (Node.js + Express + JWT)"));
for (const [name, content] of Object.entries(authFiles)) {
  children.push(...codeBlock(name, content));
}
children.push(pb());

children.push(h2("10.2 api-service (Node.js + Express + MongoDB)"));
for (const [name, content] of Object.entries(apiFiles)) {
  children.push(...codeBlock(name, content));
}
children.push(pb());

children.push(h2("10.3 architect-service (Spring Boot + Java 26)"));
for (const [name, content] of Object.entries(archFiles)) {
  children.push(...codeBlock(name, content));
}
children.push(pb());

// ── 11. SCREENSHOTS ───────────────────────────────────────────────
children.push(
  h1("11. Application Screenshots"),
  body("Note: Client-side screenshots and MongoDB Compass screenshots to be inserted below."),
  ...sp(1),
  ...screenshot("11.1  Home Page \u2013 Landing (Not Logged In)"),
  ...screenshot("11.2  Home Page \u2013 Dashboard (Logged In)"),
  ...screenshot("11.3  Login Page"),
  ...screenshot("11.4  Register Page"),
  ...screenshot("11.5  Kernel Vault \u2013 Snippet Library & Search"),
  ...screenshot("11.6  Kernel Vault \u2013 Tag Filter & Stats"),
  ...screenshot("11.7  System Pulse \u2013 OS Health Dashboard"),
  ...screenshot("11.8  Log Streamer \u2013 Live SSE Terminal"),
  ...screenshot("11.9  Architect \u2013 Dockerfile Generator Form"),
  ...screenshot("11.10 Architect \u2013 Generated Output + Download"),
  ...screenshot("11.11 KubeCloud \u2013 YAML Validator"),
  ...screenshot("11.12 Profile Page"),
  ...screenshot("11.13 MongoDB Compass \u2013 sentineldb Database"),
  ...screenshot("11.14 MongoDB Compass \u2013 Users Collection"),
  ...screenshot("11.15 MongoDB Compass \u2013 Snippets Collection"),
  ...screenshot("11.16 Postman \u2013 auth-service API Testing"),
  ...screenshot("11.17 Postman \u2013 api-service API Testing"),
  ...screenshot("11.18 Postman \u2013 architect-service API Testing"),
  pb()
);

// ── 12. CONCLUSION ────────────────────────────────────────────────
children.push(
  h1("12. Conclusion"),
  body("The Sentinel DevOps Intelligence Platform was successfully developed as a full-stack microservices project, demonstrating comprehensive coverage of the AWT syllabus. The project\u2019s microservices architecture \u2014 three independent services communicating via REST APIs \u2014 directly fulfils the Unit 6 requirement for Spring Boot Microservices."),
  ...sp(1),
  body("Key syllabus achievements: Unit 2 is demonstrated through System Pulse\u2019s use of the Node.js os built-in module and Log Streamer\u2019s use of the fs module, Streams, and Buffers \u2014 concepts most student projects overlook. Unit 3 is covered through Express.js routing, custom middleware, cookie management, and JWT-based API security across two Node.js services. Unit 4 is demonstrated through MongoDB aggregation pipelines in Kernel Vault using $unwind, $group, $sort, and $project stages for tag statistics, difficulty breakdowns, and usage-ranked queries. Unit 6 is covered through React.js (functional components, hooks, Context API, React Router) and Spring Boot (RESTful services, constructor dependency injection, @RestControllerAdvice exception handling, bean validation)."),
  ...sp(1),
  body("The stateless architect-service (no database, pure business logic) demonstrates proper microservice design where services have a single, well-defined responsibility. The shared JWT_SECRET between auth-service and api-service demonstrates stateless authentication in a distributed system without a shared session store."),
  ...sp(1)
);

// ── 13. REVIEW QUESTIONS ──────────────────────────────────────────
children.push(
  h1("13. Review Questions"),
  bullet("What is the difference between a monolithic and a microservices architecture? What are the advantages and disadvantages of each?"),
  bullet("Explain the Node.js os module. What information does it provide and how is it used in System Pulse?"),
  bullet("How do Node.js Streams work? Explain the difference between Readable, Writable, and Transform streams."),
  bullet("What are Server-Sent Events (SSE)? How do they differ from WebSockets and regular HTTP polling?"),
  bullet("Explain MongoDB\u2019s aggregation pipeline. What is the purpose of $unwind and how does it work on an array field?"),
  bullet("What is Spring Boot\u2019s @RestControllerAdvice? How does it differ from try-catch blocks in individual controllers?"),
  bullet("Explain constructor injection vs field injection in Spring Boot. Why is constructor injection preferred?"),
  bullet("How does the shared JWT_SECRET between auth-service and api-service enable stateless authentication across microservices?"),
  bullet("What is the purpose of the Vite proxy in development? How does it eliminate CORS issues?"),
  bullet("Why is the architect-service stateless (no database)? What makes a service stateless and why is it beneficial in a microservices context?"),
);

// ── DOCUMENT ──────────────────────────────────────────────────────
const doc = new Document({
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 500, hanging: 260 } } } }] }] },
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
      }
    },
    headers: { default: new Header({ children: [new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT, space: 4 } },
      children: [
        new TextRun({ text: "Sentinel \u2013 AWT Project Report", bold: true, size: 16, font: "Arial", color: BLUE }),
        new TextRun({ text: "\t\t", size: 16 }),
        new TextRun({ text: "R. N. G. Patel Institute of Technology | 1CS403", size: 16, font: "Arial", color: DGRAY }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }]
    })]}) },
    footers: { default: new Footer({ children: [new Paragraph({
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: ACCENT, space: 4 } },
      children: [
        new TextRun({ text: "Advanced Web Technologies (1CS403) | Semester IV | AY 2025\u20132026", size: 16, font: "Arial", color: DGRAY }),
        new TextRun({ text: "\t", size: 16 }),
        new TextRun({ text: "Page ", size: 16, font: "Arial", color: DGRAY }),
        new TextRun({
        children: [PageNumber.CURRENT],
        size: 16,
        font: "Arial",
        color: DGRAY // No quotes here
    }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }]
    })]}) },
    children
  }]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('C:/Users/harsh/Downloads/Sentinel_ProjectReport.docx', buffer);
  console.log('Sentinel report generated!');
}).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
