# BUE Specialization Recommender

This web application provides an interactive platform where users can receive personalized career specialization recommendations, explore career options, access a wide range of online courses, and create or view reviews about the system. The backend is built with Node.js, Express, and MongoDB Atlas, while the frontend is created using React with Vite.

## Features

### 1. **User Authentication (Sign Up & Login)**
- **Sign Up:** Users can create an account by providing a username, password, and name. The application checks if the username is already taken.
- **Login:** Users can log in using their credentials (username and password). A JSON Web Token (JWT) is generated on successful login, which is used for authenticated requests.
- **Token Management:** The application supports JWT authentication, where the token is used to verify the user's identity for protected routes and also to check if the token has expired.

### 2. **Personalized Career Recommendations**
- Users can receive personalized career specialization recommendations based on their grades and responses to an MCQ.
- The system analyzes the provided data and generates a recommendation, along with confidence scores for each specialization.
- The recommendation result is saved in the database for further reference.

### 3. **Career Exploration**
- Users can explore different specializations and careers.
- **Specializations & Career Options:** Users can retrieve all available specializations from the database. Based on a selected specialization, users can view the corresponding career options that match their choice. Both specializations and career options are dynamically fetched from the database, providing users with up-to-date and relevant information.

### 4. **Knowledge Hub (Courses)**
- Users can explore a variety of online courses based on their search criteria.
- The application fetches course data from Coursera's external API, ensuring that the courses displayed are up-to-date and relevant to the user's interests.
- The application provides a search functionality that allows users to find courses matching their query.

### 5. **Reviews for Courses & Specializations**
- **Create Review:** Users can write reviews based on their past experiences with the system.
- **View Reviews:** Users can retrieve reviews they have created to view their past interactions.
- **Update Review:** Users can edit their previous reviews.
- **Delete Review:** Users can delete their previous reviews.

## Technologies Used

### Frontend
- **React (18.3.1)**: The user interface is built with React, making it dynamic and responsive.
- **Vite**: Vite is used for fast development and building the frontend application.

### Backend
- **Node.js (22.8.0) & Express**: The server is built using Node.js and Express, making the backend lightweight and efficient.
- **MongoDB Atlas**: The application uses MongoDB Atlas for data storage, providing a fully managed database solution.
- **JWT Authentication**: JSON Web Tokens (JWT) are used for user authentication and authorization.
- **Nodemon**: Nodemon is used in the backend to automatically restart the server during development whenever file changes are detected.

### Additional Libraries & Tools
- **bcrypt**: For hashing passwords to ensure security.
- **body-parser**: For parsing incoming request bodies.
- **cors**: To handle cross-origin requests.
- **dotenv**: For environment variable management.

## API Endpoints

### Authentication Routes
- **POST /signup**: Create a new user.
- **POST /login**: Log in a user and receive a JWT token.
- **GET /user**: Get user information based on the JWT token.
- **PUT /user**: Update user profile information.
- **GET /check-token**: Check if the provided JWT token is valid or expired.

### Career Routes
- **GET /get-specializations**: Fetch all available specializations.
- **GET /explore-career-options**: Fetch careers based on a provided specialization.

### Knowledge Hub Routes
- **GET /get-courses**: Fetch courses based on the provided query string.

### Recommendation Routes
- **POST /recommend-specialization**: Provide career recommendations based on grades and MCQ responses.

### Review Routes
- **POST /reviews**: Create a review.
- **GET /reviews**: Get reviews created by the authenticated user.
- **PUT /reviews/:id**: Update an existing review.
- **DELETE /reviews/:id**: Delete a review.

## Database

The application uses **MongoDB Atlas** as the cloud-based database solution. MongoDB is a NoSQL database that allows flexible and scalable data storage. MongoDB Atlas provides managed MongoDB databases with high availability and automated backups, ensuring the safety and integrity of user data.

### Collections
- **Users**: Stores user details such as username, password, and name.
- **Careers**: Stores career options related to different specializations.
- **Reviews**: Stores user reviews.
- **RecommendationResults**: Stores recommendation results along with grades and MCQ responses.

## Installation

### Prerequisites
Make sure you have the following installed:
- Node.js
- npm or yarn
- MongoDB Atlas account (for database)

### Setup Instructions

1. Clone the repository:
    ```
    git clone https://github.com/Mohamed-Samehh/BUE-Spec-Path/
    cd BUE-Spec-Path
    ```

2. Install dependencies in root folder:
    ```
    npm install
    ```

3. Install dependencies in backend folder:
    ```
    cd backend
    npm install
    ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add your environment variables. Example:
   ```
   DB_URI=mongodb+srv://your-mongo-connection-string
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

5. Start the backend using `Nodemon` from backend folder:
   ```
   cd backend
   npm run dev
   ```

6. Start the application using `Vite` from root folder:
   ```
   npm run dev
   ```

 The frontend will be accessible at http://localhost:5173, and the backend API will be available at http://localhost:5000.
