# DBMSproj

A web-based application developed as a Database Management Systems (DBMS) project.
This project utilizes Node.js, Express.js, and a relational database to manage and display data through a user-friendly interface.

## Features

- User authentication and session management
- CRUD (Create, Read, Update, Delete) operations on database entries
- Structured routing using Express.js
- Modular codebase with separate controllers and routes
- Responsive front-end design using HTML, CSS, and JavaScript

## Project Structure

```
DBMSproj/
├── config/             # Configuration files (e.g., database connection)
├── controllers/        # Route handler functions
├── database/           # SQL scripts and database schema
├── public/             # Static assets (CSS, JS, images)
├── routes/             # Express route definitions
├── views/              # EJS templates for rendering HTML
├── server.js           # Main server file
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Praneel3112/DBMSproj.git
   cd DBMSproj
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the database:**

   - Set up your relational database (e.g., MySQL, PostgreSQL).
   - Update the database configuration in `config/db.js` with your credentials.
   - Run the SQL scripts in the `database/` directory to initialize the schema.

4. **Start the server:**

   ```bash
   npm start
   ```

   The application will be accessible at `http://localhost:3000`.

## Usage

- Navigate to `http://localhost:3000` in your web browser.
- Use the application to perform various database operations through the web interface.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the [MIT License](LICENSE).
