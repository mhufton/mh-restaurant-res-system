# Periodic Tables: Restaurant Reservation System

> Live deployment on Heroku: <br> [Periodic Tables]https://mh-restaurant-res-sys-frontend.herokuapp.com/dashboard

 ## most up to date branch is "new-design"


## Summary
Periodic Tables (PT) is a restaurant reservation system desgined to be used by a restaurant manager/owner. The application allows the user to control all aspects of reservations and tables within the restaurant. This allows the user to have a clear view of the current status of the restaurant and quickly manage reservations as needed.
 * Reservations
    * View all reservations for a specified date
    * Create new Reservations
    * Cancel existing Reservations
    * Search for a reservation via the customer's phone number
    * Edit/update existing reservation details and status 
    * Seat a reservation at a table
* Tables
    * View all tables and whether they are occupied or open
    * Create new tables
    * Clear tables (When a reservation is finished and the table is ready for the next guest)
        * Changes an occupied table's status from "Occupied" to "Free"
* Built-in validation
    * Application ensures reservations can only be created/updated within a valid date/time-window
        * Cannot create reservations for past dates, reservations can only be created between 9:30 am and 10:30 pm
        * Reservations cannot be created for Tuesdays (Restaurant closed)
        * Validates all inputs for proper formatting
    * When the user attempts to seat a reservation at a table, the application will make sure that the selected table has proper capacity for the reservation
    * Unoccupied tables cannot be cleared
***
## Technology
### <u>Client</u>
* Built with create-react-app.
* Uses [react-router](https://reactrouter.com/) for front-end routing
* Styling is mostly vanilla CSS but also incorporates some [Bootstrap](https://getbootstrap.com/)
### <u>Server</u>
* Node and Express
* Utilizes [Knex](https://knexjs.org/) for PostgreSQL query building
### <u>Database</u>
* Hosted by ElphantSQL
***
## API Documentation
<br/>

## Reservations
```http
GET /reservations
```

Sending a GET request to the /reservations endpoint with no parameters will retrieve of all current reservations that have a status of <b>booked</b>, <b>seated</b>, or <b>cancelled</b>. Reservations with a status of <b>finished</b> will be excluded.

### Accepted Query Parameters:

| Parameter       | Type     | Description                                                                                  | Example                                                                      |
| :-------------- | :------- | :------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `date`| `string` | **optional**: returns all reservations for a specific date using YYYY-MM-DD format| /reservations?date=2022-01-21                                                |
| `mobile_number` | `string` | **optional**: returns all reservations for a specific phone number using xxx-xxx-xxxx format | /reservations?mobile_number=123-456-7891 \*note: returns partial matches too |

### Responses:

Response body of a GET request in JSON format:

```javascript
{
    "data": [
        {
            "reservation_id": 2,
            "first_name": "Frank",
            "last_name": "Palicky",
            "mobile_number": "202-555-0153",
            "reservation_date": "2020-12-30T00:00:00.000Z",
            "reservation_time": "20:00",
            "people": 1,
            "status": "booked",
            "created_at": "2020-12-10T08:31:32.326Z",
            "updated_at": "2020-12-10T08:31:32.326Z"
        },
    ]
}
```
<br>

***
```http
GET /reservations/:reservation_id
```

Sending a GET request to the /reservations/:reservation_id endpoint  will return the reservation with the corresponding <b>reservation_id</b>

### Accepted Parameters:

| Parameter       | Type     | Description                                                                                  | Example                                                                      |
| :-------------- | :------- | :------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `reservation_id`| `integer` | **optional**: returns a specifc reservation                                               | /reservations/1
***
<br>

```http
PUT /reservations/:reservation_id
```

Sending a PUT request to the /reservations/:reservation_id endpoint will update an existing reservation

### Accepted Parameters:

| Parameter       | Type     | Description                                                                                  | Example                                                                      |
| :-------------- | :------- | :------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `reservation_id`| `integer` | **required**: specifies the reservation that will be updated| /reservations/1                                       |


### Example Request:

Making a PUT request should have this format:

```javascript
{
    "data": {
        "first_name": "John",
        "last_name": "Doe",
        "mobile_number": "202-555-0153",
        "reservation_date": "2022-01-21"
        "reservation_time": "12:00",
        "people": 3,
    }
}
```
<br>

***
```http
POST /reservations
```

Creates a new reservation

### Example Request and Response:

Making a POST request should have this format:

```javascript
{
    "data": {
        "first_name": "John",
        "last_name": "Doe",
        "mobile_number": "202-555-0153",
        "reservation_date": "2022-01-21"
        "reservation_time": "12:00",
        "people": 3,
    }
}
```

A successful POST will return a 201 'CREATED' status code along with the body of the newly created reservation :  
```javascript
{
    "data": {
        "reservation_id": 11,
        "first_name": "Frank",
        "last_name": "Palicky",
        "mobile_number": "202-555-0153",
        "reservation_date": "2020-12-30T00:00:00.000Z",
        "reservation_time": "20:00",
        "people": 1,
        "status": "booked",
        "created_at": "2022-01-21T16:38:45.053Z",
        "updated_at": "2022-01-21T16:38:45.053Z"
    }
}
```
<br>

***
```http
PUT /reservations/:reservation_id/status
```

Sending a PUT request to the /reservations/:reservation_id/status endpoint will update the status of the reservation to either <b>seated</b>, <b>finished</b>, or <b>cancelled</b>. Reservations with a status of <b>finished</b> will be excluded.

### Accepted Parameters:

| Parameter       | Type     | Description                                                                                  | Example                                                                      |
| :-------------- | :------- | :------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `reservation_id`| `integer` | **required**: specifies the reservation whose status will be updated| /reservations/1/status                                       |


### Example Request:

Making a PUT request should have this format:

```javascript
{
    "data": {
        "status": "booked"
    }
}
```
***
## Tables 


```http
GET /tables
```

Sending a GET request to the /tables endpoint will return all information regarding each table

### Accepted Query Parameters: N/A



### Responses:

Response body of a GET request in JSON format:

```javascript
{
    "data": [
        {
            "table_id": 3,
            "table_name": "#1",
            "capacity": 6,
            "reservation_id": null,
            "created_at": "2022-01-20T20:45:06.739Z",
            "updated_at": "2022-01-20T20:45:06.739Z"
        },
    ]
}
```
* Note: once a reservation is seated at a table, the table's reservation_id property will be updated to the corresponding ID of the reservation

<br>

***
```http
POST /tables
```

Creates a new table

### Example Request and Response:

Making a POST request should have this format:

```javascript
{
    "data": {
        "table_name": "booth #2",
        "capacity" : 4
    }
}
```

A successful POST will return a 201 'CREATED' status code along with the body of the newly created table :  
```javascript
{
    "data": {
        "table_id": 6,
        "table_name": "booth #2",
        "capacity": 4,
        "reservation_id": null,
        "created_at": "2022-01-21T17:29:41.538Z",
        "updated_at": "2022-01-21T17:29:41.538Z"
    }
}
```
<br>

***
```http
PUT /tables/:table_id/seat
```

Sending a PUT request to the /tables/:table_id/seat endpoint will update the table's <b>reservation_id</b> value to the ID of the reservation that is being seated. This will also update the reservation with a <b>seated</b> status

### Accepted Parameters:

| Parameter       | Type     | Description                                                                                  | Example                                                                      |
| :-------------- | :------- | :------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `table_id`| `integer` | **required**: specifies the table whose reservation_id will be updated| /tables/1/seat                                       |


### Example Request:

Making a PUT request should have this format:

```javascript
{
    "data": {
        "reservation_id": 1
    }
}
```
<br>

***
```http
DELETE /tables/:table_id/seat
```
Sending a DELETE request to the /tables/:table_id/seat endpoint will update the status of the reservation at the table to <b>finished</b> and clear the tables <b>reservation_id</b> value  (the table will not be deleted)


<br>

***
```http
GET /tables/:table_id
```

Sending a GET request to the /tables/:table_id endpoint will return the table with the corresponding <b>table_id</b>

### Accepted Parameters:

| Parameter       | Type     | Description                                                                                  | Example                                                                      |
| :-------------- | :------- | :------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `table_id`| `integer` | **required**: returns a specifc table                                               | /tables/1
***
## Installation
```
1. Fork and clone this repository.
2. Run cp ./back-end/.env.sample ./back-end/.env.
3. Update the ./back-end/.env file with the connection URLs to your ElephantSQL database instance.
4. Run cp ./front-end/.env.sample ./front-end/.env.
5. You should not need to make changes to the ./front-end/.env file unless you want to connect to a backend at a 6. location other than http://localhost:5000.
7. Run npm install to install project dependencies.
8. Run npm run start:dev to start your server in development mode.
```

# Screenshots
1. ![Dashboard](/front-end/src/utils/readMeScreenShots/dashboard.png "Dashboard")
2. ![Seat Reservation](front-end/src/utils/readMeScreenShots/seating.png "Seat Reservation")
3. ![Cancel Reservation](/front-end/src/utils/readMeScreenShots/cancelRes.png "Cancel Reservation")
4. ![Edit Reservation](/front-end/src/utils/readMeScreenShots/editRes.png "Edit Reservation")
5. ![Search for Reservation](/front-end/src/utils/readMeScreenShots/search0.png "Searching reservation by phone number")
6. ![Search for Reservation](/front-end/src/utils/readMeScreenShots/search1.png "Searching reservation by phone number with results")
7. ![Create New Reservation](/front-end/src/utils/readMeScreenShots/create.png "Create new reservation")
8. ![Create New Table](/front-end/src/utils/readMeScreenShots/createTable.png "Create New Table")
9. ![Finish reservation and clear table](/front-end/src/utils/readMeScreenShots/finsihTable.png "Finish reservation and clear table")
