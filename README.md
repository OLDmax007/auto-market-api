# AutoMarket API

[Click to read in UKRAINIAN](./README.ua.md)

Advanced platform for car sales, developed with a focus on high performance, architectural flexibility, and the possibility of future scaling to the level of large car dealerships.

## Architecture and Technical Solutions

According to the TS developed:

* **Hybrid RBAC/ABAC System**: Access is built on a system of permissions (Permissions). This allows easily adding new roles (for example, "Mechanic" or "Sales for car dealership") without changing the base code.
* **Scalability Ready**: The modular structure of the backend part allows moving individual services (for example, moderation or exchange rate analytics) into microservices in the future.
* **Automatic Moderation**: Integrated system for checking content for profanity.
* **Dynamic Currency Engine**: Real-time price calculation based on PrivatBank API with fixing the rate at the time of publication.

## Technical features and integrations

### 1. Working with media files (AWS S3)
* **Scalability**: Using cloud storage allows the system to process a large amount of content without load on the server's local disk.
* **Optimization**: Validation of formats (JPG, PNG) and file size limits at the Middleware level.
* **Security**: Access control for deleting objects — only authors of listings or moderators can delete photos.

### 2. Notification system (Nodemailer)

* **Account verification**: Secure email confirmation after registration.
* **Support Tickets**: Automatic generation and sending of requests to administration if a user wants to add a new car brand or model to the system.

### 3. Data processing and validation
* **Mongoose Middleware**: Automatic password hashing (bcrypt) and deep data validation before saving to MongoDB.
* **Performance (Indexing)**: Configured index bases for the most frequently used search fields (brand, price, region), which guarantees fast operation of filters with large volumes of data.
* **Data Normalization Strategy**:
    - **Technical Keys**: Car makes, models, and regions are stored in `lowercase` to ensure high-speed indexing and reliable filtering.
    - **Display Data**: City names are stored in `Title Case` (e.g., "Bila Tserkva") to preserve correct spelling for the UI without extra processing.
    - **Custom Suggestions**: Users can suggest new car makes or models through a dedicated validation layer (Regex-based), which are then flagged for administrative review.

### 4. Automation (Cron Jobs)

* **Currency rates**: Daily automatic update of rates (USD, EUR) via PrivatBank API to update prices in listings.
* **Subscription management**: Automatic checking of premium account validity periods and their transfer to the base tariff after the term expires.

### 5. Advanced Search & Filtering (Query Engine)
* **Flexible Filtering**: Support for complex query parameters including price ranges (`minPrice`, `maxPrice`), manufacturing year, and technical specifications.
* **Search Optimization**: Automatic normalization of search queries. The system handles case-insensitive lookups for car makes and models, ensuring a seamless search experience.
* **Pagination & Sorting**: Built-in support for `limit`, `offset`, and dynamic sorting (by price, date, or popularity) to optimize frontend performance and reduce payload size.

### 6. Database Seeding (Initial Data)

To ensure the platform is ready for use immediately after deployment, the built-in seeder automatically performs the following actions:

* **Vehicle Catalog**: Populates the database with a comprehensive map of car makes and models (`BMW`, `Daewoo`) to enable dropdowns and filters.
* **Geography**: Pre-fills regions and major cities to standardize location-based search and ensure data consistency.
* **RBAC Initialization**: Sets up the core role structure (`admin`, `manager`, `seller`, `visitor`) and maps the corresponding permission sets to each role.
* **System Permissions**: Initializes all required permissions that govern access to specific API endpoints.

## Roles in the system

| Role | Description |
| :--- | :--- |
| **Buyer** | Base role for car search and contacting sellers. |
| **Seller** | Can place listings (Basic: 1 car, Premium: unlimited). |
| **Manager** | Moderator: checks listings, bans violators. |
| **Administrator** | Full access to the system and management of personnel (managers). |

## Tech stack

* **Backend**: Node.js, TypeScript, Express.
* **Database**: MongoDB (Mongoose).
* **Documentation**: Swagger (OpenAPI 3.0).
* **DevOps**: Docker, Docker Compose.

# Launch

## 1. Environment configuration

For stable operation of the platform, it is necessary to configure environment variables.

The project already has an example of a variables file — **`.env.example`**.  
No need to create `.env` manually. Just copy the example:

```bash
cp .env.example .env
```

### Environment Setup Details

You need to set up the `.env` file for the following services to work:

* **Authentication**: Generate your own unique random strings for all `JWT_SECRET` variables.
* **Database**: Provide your `MONGO_URI`. The system expects a MongoDB Atlas or local instance.
* **Email (Nodemailer)**: Use a Gmail "App Password" for `EMAIL_PASSWORD`. This is required for account verification.
* **Cloud Storage (AWS S3)**: Required for car images. Ensure your IAM user has `PutObject` and `DeleteObject` permissions.
* **App URL**:
    - `FRONTEND_URL`: Essential for generating valid links in verification emails (via `buildLink`). Your frontend handles the token and calls the API.
    - `BACKEND_URL`: The base URL of your API, used for internal logic and CORS configuration.

## 2. Super Admin Configuration

The project includes a built-in seeder for automatic administrator creation and populating the database with test data.

All super-admin parameters are managed via environment variables. You can modify them in the `.env` file before launching:

* **Email**: `SEED_ADMIN_EMAIL` — used for login credentials.
* **Password**: `SEED_ADMIN_PASSWORD` — password for the initial login.
* **Personal Data**: `SEED_ADMIN_FIRSTNAME`, `SEED_ADMIN_LASTNAME`, `SEED_ADMIN_AGE`.

### Testing Features
For easier testing, the seeder scripts include:

* **Initial Balance**: The super-admin is initialized with a test balance of **100,000 UAH**. This allows for immediate testing of **Premium** account purchases and other paid services without manual top-ups.
* **Roles**: Automatic assignment of the `ADMIN` role with a full set of permissions to the super-user.

**Note:** To update admin data or balance after the database has been initialized, run:
```bash 
docker-compose run --rm seeder 
```

## 3. Docker Services & Scripts Description

The project is fully containerized and consists of two main services. The entire configuration is based on the `node:20-alpine` image.

### 1. Services

| Service | Container Name | Port | Description |
| :--- | :--- | :--- | :--- |
| **backend** | `auto-market-backend` | `5000:5000` | Main API application (NestJS/Express). |
| **seeder** | (Temporary) | - | Database initialization script. |

### 2. Scripts & Commands

Use the following commands for correct project startup and container interaction:

* **Launch the entire project (API + Seeder)**:
    ```bash
    docker-compose up --build
    ```
  The service automatically executes the `./scripts/main-seed.ts` script using `tsx`. It initializes the Roles & Permissions (RBAC) structure, registers the Super-Admin (using data from your `.env`), and populates the database with car makes and models for the filtering system.

* **Access the backend terminal**:
    ```bash
    docker exec -it auto-market-backend sh
    ```

* **View logs (to retrieve the Action Token)**:
    ```bash
    docker-compose logs -f backend
    ```

* **Restart Seeder manually (to update data)**:
    ```bash
    docker-compose run --rm seeder
    ```

* **Start Backend only**:
    ```bash
    docker-compose up backend
    ```

* **Start Seeder only**:
    ```bash
    docker-compose up seeder
    ```

# Postman Testing

A ready-to-use request collection is provided for quick functional testing.

## How to Import:
* Download and install [Postman](https://www.postman.com/downloads/).
* Navigate to the `postman/` folder in the project root.
* Import the `collection.json` (requests) and `environment.json` (environment variables) files into Postman.

## Using Variables
Ensure the following variables are set in your Postman Environment:
* `{{HOST}}` — your API address (e.g., `http://localhost:5000`).
* `{{accessToken}}` — automatically populated after login.

## Token Management:
The collection is pre-configured for **Bearer Token** authentication. After registration (`Sign Up`) or authorization (`Sign In`), a Postman script automatically captures your Access Token and applies it to subsequent requests.

## Structure and Modules

The collection is organized to separate public operations, user actions, and administrative functions:

* **🔐 Auth**: Access management.
    * Registration, login, email verification.
    * Password reset and **refresh token** mechanism.
    * Option to log out from all devices simultaneously (**logout all**).
* **🚗 Car**: Working with the car database. Retrieving the list of makes and models available in the system and sending an email about a non-existent model or make.
* **📋 Listings**: Working with advertisements.
    * Creating, editing, viewing ad statistics, and searching for cars.
    * 📁 **Staff (nested)**: Ad moderation and management of any listing.
* **👤 Me**: Personal dashboard.
    * Balance management (**top up balance**) and changing status to seller.
    * Premium plan purchase (**upgrade plan**).
    * Uploading or deleting an avatar.
* **👥 Users**
    * Viewing public user information.
    * 📁 **Staff (nested)**: Module for administrators.
        * Viewing the list of all users.
        * Managing user roles and statuses.
        * Ability to delete or block accounts.
* **💎 Subscriptions (Staff)**: Admin panel.
    * Subscription variable.
    * Subscription Activation/Deactivation.

# API Documentation

* **Swagger UI**: http://localhost:5000/docs — interactive description of all requests.
* **Postman**: Collection file in the **/postman** folder. Already contains variables for quick testing of admin and regular user functions.