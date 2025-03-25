# Horse Racing Website API Documentation

This document provides information about the API functionality added to the Horse Racing Website.

## Authentication API

The authentication API allows users to register, login, and logout. It uses Cloudflare D1 Database for storing user data and sessions.

### Endpoints

#### POST /api/auth

This endpoint handles user authentication operations.

**Request Body:**

```json
{
  "username": "string",
  "password": "string",
  "action": "login | register | logout"
}
```

**Actions:**

1. **login**: Authenticates a user and creates a session
   - Success Response: `{ "success": true, "user": { "id": number, "username": string, "role": string } }`
   - Error Response: `{ "error": "Invalid credentials" }` (401)

2. **register**: Creates a new user account
   - Success Response: `{ "success": true, "message": "User registered successfully" }`
   - Error Response: `{ "error": "Username already exists" }` (400)

3. **logout**: Ends the current user session
   - Success Response: `{ "success": true, "message": "Logged out successfully" }`

#### GET /api/auth

This endpoint checks if a user is currently authenticated.

**Response:**

- Authenticated: `{ "authenticated": true, "user": { "id": number, "username": string, "role": string } }`
- Not Authenticated: `{ "authenticated": false }`

## Database Setup

The database schema is defined in the `migrations/0002_users.sql` file. It creates two tables:

1. **users**: Stores user information
   - id: Primary key
   - username: Unique username
   - email: Unique email address
   - password_hash: Bcrypt hashed password
   - full_name: Optional full name
   - role: User role (admin or user)
   - created_at: Timestamp of account creation
   - updated_at: Timestamp of last update

2. **sessions**: Stores active user sessions
   - id: Primary key (UUID)
   - user_id: Foreign key to users table
   - expires_at: Session expiration timestamp
   - created_at: Timestamp of session creation

## Authentication Components

### AuthStatus Component

The `AuthStatus` component displays the current authentication status in the UI. It shows:

- "Sign In" and "Register" buttons when the user is not authenticated
- Username and "Sign Out" button when the user is authenticated

### Login Page

The login page (`/login`) allows users to sign in with their username and password.

### Register Page

The register page (`/register`) allows new users to create an account.

## API Settings Page

The API settings page (`/api/settings`) allows administrators to configure API integrations for live racing data. It includes:

1. **Live Data API Configuration**
   - API Provider selection
   - API Key and Secret management
   - Endpoint URL configuration
   - Update frequency settings

2. **Model Training Integration**
   - Training mode configuration
   - Data threshold settings
   - Training schedule options
   - Historical data inclusion options

3. **API Status and Testing**
   - Connection status monitoring
   - Test API connection functionality
   - Data synchronization controls
   - API logs access

## Required Dependencies

The following dependencies are required for the API functionality:

- bcryptjs: For password hashing
- uuid: For generating unique session IDs
- @cloudflare/workers-types: For Cloudflare D1 Database types

## Getting Started

1. Install the required dependencies:
   ```
   npm install
   ```

2. Set up the database:
   - For local development, you can use SQLite
   - For production, configure Cloudflare D1 Database

3. Run the migrations:
   ```
   npx wrangler d1 execute <DATABASE_NAME> --file=./migrations/0002_users.sql
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Access the API settings page at `/api/settings`

## Default Admin Account

A default admin account is created during migration:
- Username: admin
- Password: admin123

**Important:** Change the default admin password in production environments.