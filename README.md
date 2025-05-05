# University-Scheduler

University Course Scheduler is a comprehensive system for automating the creation of university course schedules using constraint-based optimization. The system can generate optimal schedules that satisfy complex requirements such as professor availability, course prerequisites, cross-program course sharing, and time slot constraints.

## Architecture Overview

The application uses a hybrid architecture combining a Node.js/Express backend with a Python-based constraint solving engine:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   React +       │     │  Node.js +       │     │  Python +           │
│   TypeScript    │◄───►│  Express +       │◄───►│  Google OR-Tools    │
│   Frontend      │     │  Sequelize ORM   │     │  Constraint Solver  │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
        ▲                        ▲
        │                        │
        └────────────┬───────────┘
                     ▼
               ┌──────────────┐
               │  PostgreSQL  │
               │  Database    │
               └──────────────┘
```

### Key Components

1. **Frontend**: React with TypeScript and Material UI
   - User interfaces for administrators and professors
   - Course, program, and department management
   - Schedule visualization and conflict resolution

2. **Backend API**: Node.js with Express.js
   - RESTful API 
   - Sequelize ORM for database operations
   
3. **Scheduler Engine**: Python with Google OR-Tools
   - Constraint Programming (CP-SAT) solver
   - Advanced constraints handling
   - Pattern-based scheduling for multi-class courses
   - Balancing course distribution

4. **Database**: PostgreSQL relational database
   - Stores all entities and relationships
   - Maintains data integrity through foreign key constraints

## Directory Structure

```
university-scheduler/
├── backend/              # Node.js Express API
│   ├── app/
│   │   ├── models/       # Sequelize models
│   │   └── ...
│   ├── scripts/          # Setup and utility scripts
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # API controllers
│   │   ├── middleware/   # Auth middleware
│   │   ├── routes/       # API routes
│   │   ├── server.js     # Express setup
│   │   └── index.js      # Entry point
│   └── python/
│       ├── course_scheduler.py    # OR-Tools implementation
│       ├── scheduler_interface.py # Node.js interface
│       └── test_scheduler.py      # Testing script
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/       # Static assets
│       ├── components/   # React components
│       │   ├── admin/    # Admin interface components
│       │   ├── auth/     # Authentication components
│       │   └── common/   # Shared components
│       ├── contexts/     # React context providers
│       ├── services/     # API service modules
│       ├── App.tsx       # Main app component
│       └── index.tsx     # Entry point
├── config/               # Project configuration
├── docs/                 # Documentation
└── ...
```

## Data Model

The system uses the following key entities:

### Core Entities

- **Department**: Academic departments (Computer Science, Economics, etc.)
- **Program**: Degree programs offered by departments
- **Course**: Individual courses with duration, department, and core status
- **Professor**: Faculty members with department affiliation and availability
- **TimeSlot**: Available teaching periods (e.g., "Morning 1", 9:10-10:05)
- **Semester**: Academic terms (Fall, Spring, etc.)

### Scheduling Entities

- **Schedule**: Generated timetables for a specific semester
- **ScheduledCourse**: Individual course assignments in a schedule (course + professor + timeslot)
- **Conflict**: Identified scheduling problems that need resolution

### Relationship Entities

- **CourseProgram**: Many-to-many relationship between courses and programs
- **CoursePrerequisite**: Self-referential relationship for prerequisites
- **ProfessorAvailability**: Tracks when professors are available to teach
- **ProfessorCourse**: Tracks which professors can teach which courses
- **CourseSemester**: Tracks which semesters a course is offered in

## Key Features

1. **Multi-Program Course Association**
   - Courses can belong to multiple programs across departments
   - Program-specific attributes (core status, number of classes)

2. **Advanced Scheduling Constraints**
   - Professor availability and qualifications
   - Time slot duration matching
   - Core course prioritization
   - Pattern enforcement for multi-class courses (MW, TTh, MTTh)
   - Balanced distribution across days

3. **Conflict Detection and Resolution**
   - Identification of scheduling conflicts
   - Detailed explanations for unschedulable courses
   - Manual override capabilities for administrators

4. **Flexible Time Management**
   - Support for variable course durations
   - Different time slot patterns for different days
   - Support for single, dual, and triple class scheduling

## Scheduling Algorithm

The Python-based scheduling engine uses Google's OR-Tools CP-SAT solver to:

1. Define variables for course-professor-timeslot assignments
2. Apply hard constraints that must be satisfied:
   - Professor qualification (can teach the course)
   - Professor availability (available at assigned times)
   - Time slot matching (course duration matches slot duration)
   - Pattern enforcement (proper day patterns for multi-class courses)
   - Core course conflict prevention

3. Optimize for additional objectives:
   - Maximize the number of scheduled courses 
   - Distribute courses evenly across days
   - Balance professor workloads
   - Maintain consistent time slots for multi-class courses

## Communication Between Components

1. **Node.js to Python**:
   - Node.js collects all required data from the database
   - Data is converted to JSON and passed to Python via stdin
   - Python process is spawned using child_process.spawn()

2. **Python to Node.js**:
   - Python solver computes an optimal schedule
   - Results are returned as JSON via stdout
   - Includes scheduled courses, conflicts, and statistics

3. **Node.js to Database**:
   - Results are saved to ScheduledCourse and Conflict tables
   - Transactions ensure data integrity

4. **Node.js to Frontend**:
   - RESTful API endpoints provide schedule data
   - JWT authentication secures all communications

## Setup Requirements

1. **Backend**:
   - Node.js v22.14.0
   - Python 3.10.1
   - Python 3.9.6 (oython3)
   - PostgreSQL 14
   - OR-Tools library (`pip install ortools>=9.12.4544`)

2. **Frontend**:
   - Node.js 14+
   - npm or yarn package manager

## Deployment Considerations

1. **Environment Variables**:
   - Database connection parameters
   - JWT secret and expiration
   - Node.js and Python paths

2. **Python Environment**:
   - Python must be accessible to the Node.js process
   - Required libraries must be installed

3. **Database Setup**:
   - Initial data seeding (departments, time slots, etc.)
   - Admin user creation

