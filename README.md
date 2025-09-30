# 🍽️ React Restaurant Website

A modern, responsive **Online Restaurant Web App** built using **React (Frontend)**, **PHP (Backend)**, and **MySQL** for database management.

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-ReactJS-61DAFB?logo=react&logoColor=white&style=for-the-badge" alt="React" />
  <img src="https://img.shields.io/badge/Backend-PHP-777BB4?logo=php&logoColor=white&style=for-the-badge" alt="PHP" />
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white&style=for-the-badge" alt="MySQL" />
</p>

---

## 🚀 Features

### 👨‍🍳 Customer Side

- View dynamic menu with categories
- Add and remove items from the cart
- Place online food orders
- Login and signup functionality
- View order history

### 🧑‍💼 Admin/Librarian Side

- Secure admin login
- Dashboard with order analytics
- Add/Edit/Delete food items
- Manage customer orders and users
- Access feedback and reports

---

## 💻 Tech Stack

### Frontend

- ReactJS
- Axios
- React Router
- Context API
- CSS Modules / Custom Styles

### Backend

- PHP (Core)
- MySQL Database
- RESTful APIs
- CORS handling

---

## 📸 Screenshots

> Add your actual screenshots in the `screenshots/` folder and replace below.

![Homepage](./screenshots/homepage.png)
![Cart](./screenshots/cart.png)
![Admin Panel](./screenshots/admin-dashboard.png)

---

## ⚙️ Installation & Setup

### 🛠️ Backend Setup (PHP + MySQL)

1. Go to the `Backend` folder.
2. Import the SQL file into MySQL using phpMyAdmin or CLI.
3. Update your database credentials inside your PHP files (e.g., `db.php`).
4. Start Apache and MySQL using XAMPP or similar.

**Example `db.php` configuration:**

```php
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'restaurant_db';
