# Node E-Commerce App

This is a simple Node.js application for an e-commerce platform built using Express, MySQL, and bcrypt.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [All API Endpoints](#API Endpoints)

## Installation

Follow these steps to set up the project:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/node-ecommerce-app.git
   ```

2. Change to the project directory:

   ```bash
   cd node-ecommerce-app
   ```

3. Install the necessary dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root of the project.

## Configuration

In the `.env` file, you will need to define the following environment variables:

### Example `.env.example`:

```env
MYSQL_HOST=localhost
MYSQL_USER=
MYSQL_PASS=
MYSQL_DATABASE=
PORT=
JWT_SECRET_KEY=
```

## Running the App

To run the application locally, follow these steps:

```bash
npm start
```

## API Endpoints

### 1. **POST /api/auth/signup**

- **Description**: Creates a new user account.
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }
  ```
  - `username` (string): The name of the user.
  - `email` (string): The email of the user (must be unique).
  - `password` (string): The user's password (hashed before storage).
  - `role` (string): Role of the user, typically `"user"` or `"admin"`.

---

### 2. **POST /api/auth/login**

- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
  - `email` (string): The email of the user.
  - `password` (string): The password of the user (plaintext).

---
