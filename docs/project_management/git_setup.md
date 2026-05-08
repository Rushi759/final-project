# Git Setup and Configuration

This document outlines the Git configuration for the AgroGuru project.

## Initialization
The project was initialized with Git on 2026-05-02.

## Gitignore
A comprehensive `.gitignore` file has been added to the project root to exclude:
- **Python artifacts**: `__pycache__`, `.venv`, `*.pyc`.
- **Node.js artifacts**: `node_modules`, `build/`, `dist/`.
- **Environment variables**: `.env`, `.env.local`.
- **Log files**: `*.log`, `startup_diag.log`.
- **Project specific temporary data**: `brain/`, `scratch/`, `uploads/`, `.agents/`.
- **OS/IDE settings**: `.vscode/`, `.idea/`, `.DS_Store`.

## Repository Structure
The repository follows a clear separation between:
- `/frontend`: React application.
- `/backend`: FastAPI application.
- `/docs`: Project documentation.
- `/uploads`: User-uploaded files (ignored by Git).
