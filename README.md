# PORTAL DE NECESIDADES DIGITALES 🚀

## TABLES 📊:

1. ### USERS 👤:

   - id
   - name
   - email
   - password
   - bio
   - picture
   - registrationCode

2. ### SERVICES 🛠️:

   - id
   - user_id
   - title
   - descripcion
   - service_file
   - status

3. ### COMMENTS 📝:
   - id
   - comment
   - solved_file
   - user_id
   - service_id

## API 📚:

- POST /users

  - User registration
  - Body (form-data):
    - name \*
    - email \*
    - password \*
    - bio
    - picture
  - Returning user id and user data
  - Email confirmation sent with registration code

- GET /users/activate/:registrationCode

  - User activation
  - Returning user-activated message

- POST /login

  - User login
  - Body(JSON):
    - email \*
    - password \*
  - Returning JWT token

- GET /user

  - Displays logged user details
  - Authentication middleware

- GET /user/:userId

  - Displays any user details
  - Authentication middleware

- GET /

  - Displays registered services and their authors

- POST /services

  - Required-service registration
  - Authentication middleware
  - Body (form-data):
    - title \*
    - description \*
    - file \*
  - Returning id, title of registered service and confirmation message

- PATCH /services/:serviceId

  - Setting service status as resolved
  - Authentication middleware
  - Returning confirmation message

- GET /services/user

  - Displays services posted by their author
  - Authentication middleware

- POST /comments/:serviceId

  - Sending comment and/or solved file to a required service
  - Authentication middleware
  - Body (form-data):
    - comment
    - file
  - Returning confirmation message and comment id

- GET /getcomments/:serviceId

  - Displays comments and solved files of a given service
  - Authentication middleware

- PATCH /users

  - User data update
  - Authentication middleware
  - Body (form-data):
    - name
    - email
    - password
    - bio
    - picture
  - Returning user id and confirmation message

- DELETE /users
  - User deletion
  - Returning confirmation message
