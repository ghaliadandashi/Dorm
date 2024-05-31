# Dormitory Management System

The Dormitory Management System is a comprehensive solution designed for the students of Eastern Mediterranean University (EMU) to search, compare, and book dormitories. This platform not only facilitates the booking process but also enables users to interact with each other, sharing their opinions and experiences regarding dorms and rooms. Additionally, dorm owners have the ability to upload detailed information about their dormitories and rooms, making it easier for students to find the best accommodation options.

## Features

- **Search Dormitories**: Students can search for available dormitories based on various criteria.
- **Compare Dormitories**: Compare different dormitories to find the one that best suits your needs.
- **Book Dormitories**: Seamlessly book a dormitory through the platform.
- **User Interaction**: Students can chat with each other, sharing their thoughts and opinions about dormitories and rooms.
- **Dorm Owner Access**: Dorm owners can upload and manage information about their dormitories and rooms.

## File/Folder Structure

The project is divided into two main parts: the backend and the frontend. Below is a detailed description of the structure and purpose of each folder and file.

### Backend

The backend of the project is responsible for handling all server-side operations, including API endpoints, database interactions, and business logic.

- **controllers/**: This folder contains the controllers which handle incoming requests and return responses. Each controller corresponds to a specific part of the application (e.g., user, dormitory, booking).

- **middlewares/**: Middlewares are used for tasks such as authentication, logging, and error handling. This folder contains all the middleware functions.

- **routes/**: This folder contains the route definitions for the application. Each route file defines the endpoints and associates them with the appropriate controller functions.

- **models/**: This folder contains the database models which define the schema for the application data (e.g., User, Dormitory, Booking).

- **server.js**: This is the main entry point for the backend server. It initializes the server, connects to the database, and sets up the middleware and routes.

### Frontend

The frontend of the project is responsible for the user interface and user experience. It interacts with the backend through API calls to display and manage data.

- **src/**: This is the main source folder for the frontend code.
  - **components/**: This folder contains reusable UI components such as buttons, forms, and modals.
  - **pages/**: This folder contains the different pages of the application, each representing a different view (e.g., Home, Search Results, Booking, Chat).
  - **styling/**: This folder contains all the styling files (e.g., CSS, SASS) used across the application to maintain a consistent look and feel.
  - **layout/**: This folder contains layout components that structure the overall layout of the application, such as headers, footers, and sidebars.

## Getting Started

To get started with the Dormitory Management System, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/dormitory-management-system.git

2. **Navigate to the project directory**:
    ```bash
    cd Dorm
    
3. **Install MongoDB:**
    Follow the instructions to install MongoDB on your system from the [official MongoDB installation guide](https://www.mongodb.com/docs/manual/installation/).

4. **Start MongoDB:**
   ```bash
    mongod

5. **Install backend dependencies:**:
   ```bash
   cd backend
   npm install
   
6. **Uncomment the seedDatabase function in server.js:**
   ```javascript
    // seedDatabase();
   ```

7. **Start the backend server:**:
    ```bash
    node server.js

8. **Install frontend dependencies:**:
    ```bash
    cd ../frontend
    npm install

9. **Start the frontend development server:**:
    ```bash
    npm start