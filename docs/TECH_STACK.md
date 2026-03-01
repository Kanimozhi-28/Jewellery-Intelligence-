# Jewellery Intelligence Project - Tech Stack Review

This document provides a complete technical overview of the Jewellery Intelligence Project, a dual-portal application (Salesperson & Admin) built with a modern, high-performance stack focusing on Real-Time AI and Computer Vision.

---

## 🏗️ High-Level Architecture
The project follows a **Microservices-ready** architecture split into two distinct portals, each with its own decoupled Frontend and Backend, sharing core infrastructure.

*   **Salesperson Portal:** Focuses on operational tasks, scanning (barcodes/QR), and customer interactions.
*   **Admin Portal:** Focuses on analytics, reporting, and system management.

---

## 💻 Frontend Stack (Both Portals)
Built for speed and interactivity using the latest React ecosystem.

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | **React** | `v19.2.0` | Core UI library. Using the latest version for improved concurrent rendering. |
| **Build Tool** | **Vite** | `v7.2.4` | Extremely fast bundler and dev server. |
| **Routing** | **React Router DOM** | `v7.11.0` | Client-side routing for SPA navigation. |
| **HTTP Client** | **Axios** | `v1.13.2` | Handling API requests to the backend. |
| **Icons** | **Lucide React** | `v0.562.0` | Consistent, lightweight SVG icon library. |
| **Styling** | **CSS Modules / Custom** | N/A | Project uses a custom CSS architecture (without Tailwind dependency in `package.json`). |

### Portal-Specific Libraries
*   **Salesperson Portal:**
    *   `html5-qrcode` (`^2.3.8`): For in-browser barcode and QR code scanning.
*   **Admin Portal:**
    *   `recharts` (`^3.6.0`): For displaying data analytics, charts, and graphs.

---

## ⚙️ Backend Stack (Both Portals)
Built with Python for high-performance API handling and seamless AI integration.

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | **FastAPI** | `0.104.1` | High-performance, async web framework for building APIs. |
| **Server** | **Uvicorn** | `0.24.0` | lightning-fast ASGI server implementation. |
| **Language** | **Python** | `3.10+` | Core programming language. |
| **ORM** | **SQLAlchemy** | `2.0.23` | Database Object Relational Mapper for performing SQL operations in Python. |
| **Validation** | **Pydantic** | `2.5.2` | Data validation and settings management using Python type hinting. |

### 🔐 Security & Auth
*   `python-jose[cryptography]`: JWT (JSON Web Token) encoding/decoding for stateless authentication.
*   `passlib[bcrypt]`: Secure password hashing.
*   `python-multipart`: For handling form data and file uploads.

### 🧠 AI & Computer Vision (Core Intelligence)
The backend is heavily equipped for image processing and object detection.
*   **Ultralytics (YOLO)** (`8.0.222`): State-of-the-art real-time object detection model. Likely used for:
    *   Face Detection/Recognition
    *   Jewellery Item Detection
    *   Customer Demographics Analysis
*   **OpenCV** (`opencv-python-headless`): Core library for image manipulation and processing pipelines.

---

## 🗄️ Infrastructure & Data
The project relies on robust, industry-standard infrastructure components.

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Database** | **PostgreSQL** | Primary relational database (indicated by `psycopg2-binary`). |
| **Caching / Queue** | **Redis** (`5.0.1`) | In-memory data store. Used for caching hot data and as a message broker for Celery. |
| **Task Queue** | **Celery** (`5.3.6`) | Distributed task queue for handling asynchronous background jobs (e.g., heavy AI processing, video analysis). |
| **Object Storage** | **MinIO** (`7.2.0`) | High-performance, S3-compatible object storage. Used for storing images (faces, jewellery) and videos. |
| **Migrations** | **Alembic** (`1.13.0`) | Database schema migration tool for SQLAlchemy. |
| **Environment** | **Python-Dotenv** | Managing configuration via `.env` files. |

---

## 🚀 Summary
This stack represents a **Modern AI-First Web Application**.
*   **Frontend**: Prioritizes speed (Vite) and user experience (React 19).
*   **Backend**: Built for concurrency (FastAPI) and heavy lifting (Celery + Redis).
*   **Intelligence**: Deeply integrated Computer Vision stack (YOLO + OpenCV) suggesting widely capable video analytics features.
