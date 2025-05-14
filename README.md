# Website_project

Overview
  
  This project is a web application built using Node.js and the Express framework. 
  It integrates with a MySQL database to manage users, products, and services. 
  The application supports user registration, login, and session management with JWT tokens. 
  Additionally, it includes an admin interface for managing products and services.

Features:  

  • User Registration and Login 
  
  • JWT Authentication and Session Management 
  
  • CRUD Operations for Products and Services 
  
  • Admin-Only Access to Inventory Management 
  
  • File Upload Functionality 
  
  • Public and Admin-Specific HTML Pages 

Prerequisites:
  
  • Node.js and npm installed
  
  • MySQL installed and running

Middleware:
  
  • authenticateJWT: Middleware for verifying JWT tokens and ensuring the user is authenticated.
  
  • authorizeRole: Middleware for checking user roles to ensure only authorized users access specific routes.
  
Error Handling:

  • 404 Not Found: Returns a JSON error message if the requested resource is not found.
  
  • 500 Internal Server Error: Returns a JSON error message for any server-side errors.

  
