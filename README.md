# CrumbLoop

CrumbLoop is a web-based food waste and edible surplus management system designed for hospitality and hotel kitchen environments.

The project was developed as part of a final-year BSc Computer Science dissertation. Its aim is to explore whether a simple, low-cost web application can support food waste measurement, reporting, and surplus redistribution without relying on expensive dedicated hardware.

## Features

- Food waste recording
- Waste history tracking
- Food item management
- Cost and carbon impact reporting
- Dashboard analytics
- Edible surplus recording
- Surplus status management
- Donation partner management
- AI-assisted donation recommendations
- Donation reservation and completion workflow
- Role-based access control
- Admin user management
- Secure authentication using JWT

## User Roles

CrumbLoop supports three user roles:

- `KITCHEN_STAFF`
- `MANAGEMENT`
- `ADMIN`

Different areas of the system are protected according to the role of the authenticated user.

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing

### Database

- MongoDB Atlas

## AI-Assisted Donation Recommendation

CrumbLoop includes an AI-assisted recommendation feature that helps identify a suitable donation destination for recorded edible surplus.

The recommendation component uses a logistic regression approach trained on synthetic labelled records created for the prototype.

This feature demonstrates the technical feasibility of incorporating data-driven recommendations into the surplus redistribution workflow. It should not be interpreted as a validated real-world predictive model.

## Project Structure

```text
crumbloop/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   └── server.js
│
└── README.md

Installation

The project can be obtained either by cloning the Git repository or by extracting a submitted zip file. Both methods result in the same folder structure and the setup steps below are identical afterwards.

Option A: Clone the repository

git clone https://github.com/PariosQef/crumbloop-food-waste-tracker.git
cd crumbloop-food-waste-tracker

Option B: Extract from a zip file

Extract the submitted crumbloop.zip archive to a location of your choice, then open a terminal in the extracted folder (the one containing client/, server/ and this README.md).

Windows: right-click the zip file and choose "Extract All...", then open the extracted folder and open a terminal there (Shift + right-click → "Open PowerShell window here" or "Open in Terminal").

macOS: double-click the zip file to extract it (or run unzip crumbloop.zip in Terminal), then cd into the extracted folder.

Linux: unzip crumbloop.zip && cd crumbloop

Prerequisites (both options)

Node.js (v18 or later recommended)
npm (installed with Node.js)
A MongoDB connection string (a local MongoDB instance or a free MongoDB Atlas cluster)

Backend setup
cd server
npm install

Create a .env file based on .env.example.

Example:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5050

Start the backend using one of the following:

npm run dev

Runs the server with nodemon (auto-restarts on file changes). Recommended for development.

npm start

Runs the server directly with node server.js. Recommended when just running the app without editing code (e.g. from an extracted zip submission).

Frontend setup

Open another terminal:

cd client
npm install
npm run dev

The frontend will normally run on:

http://localhost:5173

The backend will normally run on:

http://localhost:5050

Alternative: running a production build of the frontend

Instead of the Vite dev server, the frontend can also be built and previewed as a static production bundle:

cd client
npm install
npm run build
npm run preview

This serves the optimized production build, useful for a final check that the app runs correctly outside of the development environment.
Main Application Areas
Dashboard
Log Waste
Waste History
Record Surplus
Surplus & Donations
Food Items
Users
Research Context

The system was developed to investigate the following research question:

Can a simple, low-cost web app help hotel kitchens measure and reduce avoidable food waste, without the expensive hardware that current commercial systems need?

The implemented prototype focuses on:

accessible browser-based waste recording
cost and carbon reporting
edible surplus management
donation workflow support
AI-assisted recommendation
usability across desktop and mobile interfaces

The dissertation does not claim that CrumbLoop has been proven to reduce food waste in real hospitality environments.

Instead, the project demonstrates the technical feasibility and perceived usability of a low-cost browser-based approach to recording food waste and supporting surplus redistribution.

Evaluation

The interface was prepared for usability evaluation using:

task-based usability testing
desktop and mobile prototypes
System Usability Scale (SUS)
participant feedback
usability questionnaire responses

The evaluation focuses primarily on usability, navigation, task completion, terminology, and understanding of the donation recommendation workflow.

Security

Sensitive environment variables are excluded from version control.

Do not commit:

MongoDB credentials
JWT secrets
production passwords
private environment configuration

Use .env.example to document required environment variables without exposing credentials.

Limitations

This project is an academic prototype.

Key limitations include:

AI recommendation training data is synthetic
no claim of validated real-world predictive accuracy
no long-term deployment in a live hotel kitchen
no proven real-world food waste reduction
evaluation focuses mainly on usability and technical feasibility
Author

Developed by Parios Keftai
BSc Computer Science Final Year Project