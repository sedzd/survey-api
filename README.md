# Survey API Solution

This project provides a simple API to create and take user surveys. The API is built using Node.js with Express.js framework. Data persistence is managed using a PostgreSQL database and TypeORM for database migrations and operations.

## Getting Started

These instructions will help you to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

-   Node.js v16.6.2 or higher
-   npm v7.20.3 or higher
-   Docker and Docker Compose
-   PostgreSQL database

### Installing

1. Clone the repository:

```
git clone https://github.com/sedzd/survey-api.git
```

2. Go to the project directory:

```
cd survey-api
```

3. Install the dependencies:

```
npm install
```

4. Start the PostgreSQL database using Docker Compose:

```
docker-compose up -d
```

5. Run the database migrations:

```
npm run migration:run
```

6. Run the application:

```
npm run start:dev
```

Now, the API server should be running on http://localhost:3000.



To run tests:

```
npm run test
```

## API Endpoints

Open API Specs are available at [OAS](./docs/oas.yaml)


<img width="964" alt="image" src="https://user-images.githubusercontent.com/5009973/235511481-85b94e9e-2cb9-4f8d-9d01-196a8774d846.png">


The API supports the following operations:

1. `GET /` - Get the root endpoint to check if the application is running
2. `POST /surveys` - Create a new survey
3. `POST /surveys/{surveyId}/answer` - Answer a survey
4. `GET /surveys/{surveyId}/results` - Get the results of a survey

### GET /

Get the root endpoint to check if the application is running.

Response:

```json
{
    "message": "You have successfully started the application!"
}
```

### POST /surveys

Create a new survey.

Request body:

```json
{
    "question": "What is your favorite color?",
    "answers": ["Blue", "Green", "Red", "Yellow"]
}
```

Response:

```json
{
  "id": "a84fc051-bd6a-42c5-b45a-68ef2342ba9d",
  "question": "What is your favorite color?",
  "answers": [
    {
      "id": "49252c64-e85f-4d5d-accf-d6dc89f7fac8",
      "answer": "Blue"
    },
    ...
  ],
  "created": "2023-05-01 19:45:59",
  "updated": "2023-05-01 19:45:59"
}
```

### POST /surveys/{surveyId}/answer

Answer a survey.

URL parameters:

-   surveyId (required)

Request body:

```json
{
    "userId": "12347312",
    "answerId": "0b279ce0-f608-441b-9a96-4679f5d954df"
}
```
*P.S. userId is an arbitrary string connecting a user to their answer, providing more realistic scenarios for survey results. The User domain is beyond the scope of this task.*


Response:

```json
{
    "id": "e5607f45-c678-4a5a-896e-500d6ffe8d08",
    "userId": "12347312",
    "survey": {
        "id": "ff74fd0b-9d98-4645-b59d-569d74261b0d",
        "question": "What is your favorite color?"
    },
    "userAnswer": {
        "id": "697445e4-c1d5-4b69-b9da-741720d8ce79",
        "answer": "Blue"
    },
    "created": "2023-05-01 22:17:39",
    "updated": "2023-05-01 22:17:39"
}
```

### GET /surveys/{surveyId}/results

Get the results of a survey.

URL parameters:

-   surveyId (required)

Response:

```json
[
  {
    "answerId": "0b279ce0-f608-441b-9a96-4679f5d954df",
    "answer": "Green",
    "count": "2",
    "userIds": ["123473", "123"]
  },
  ...
]
```

## ERD

![image](https://user-images.githubusercontent.com/5009973/235509202-c0c6c1b0-d604-4d53-aa8d-6d8e961b3527.png)
