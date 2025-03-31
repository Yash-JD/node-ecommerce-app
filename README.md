# Node E-Commerce App

This is a simple Node.js application for an e-commerce platform built using Express, MySQL, and bcrypt for user authentication.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)

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
MYSQL_USER=root
MYSQL_PASS=yourpassword
MYSQL_DATABASE=ecommerce_db
PORT=3000
```

## Running the App

To run the application locally, follow these steps:

```bash
npm start
```
