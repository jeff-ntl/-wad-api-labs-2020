# Assignment 2 - Web API.

Name: Teek Leng Ng (W20078325)

## Features.
 
 + Full CRUD (GET, POST, PUT, DELETE) on movies routes.
 + Private/Protected Routes - require JWT token for accessing user's favourites ('api/users/:userName/favourites').
 + React App Integration - call 'api/movies' from movies-api rather than TMDB api.
 + Helmet - improve overall security.

## Installation Requirements

Important Notes: 
+ I didn't realise I was on the wrong local repo while making commits. Because of this I couldn't push my local change directly to the remote repo. There's 2 branch on the Git remote repo ("main" and "master") at the moment. The "master" branch contains later commits. For some reason I couldn't make a pull request to combine/merge this two branches. Apologizes for all these mess.
+ To get the latest version of the app, you can either 
```bat
Download the zip folder directly from the GitHub Repo (master branch)
```

Alternatively,
```bat
git clone https://gitlab.com/jeff-ntl/api-movies.git
```

followed by installation
```bat
git install
```

## API Configuration

```bat
NODE_ENV=development
PORT=8080
HOST=localhost
TMDB_KEY=<TMDB_API_KEY>
mongoDB=mongodb+srv://admin:<password>@teekleng-atlas-cluster.emhpr.mongodb.net/test?retryWrites=true&w=majority
SEED_DB=true
SECRET=ilikecake
```

## API Design
Overview of your web API design: 

|  |  GET | POST | PUT | DELETE
| -- | -- | -- | -- | -- 
| /api/movies |Gets a list of movies | Create a new movie | N/A | N/A
| /api/movies/{movieid} | Get a Movie | N/A | Update a movie | Delete a movie
| /api/movies/{movieid}/reviews | Get all reviews for movie | N/A | N/A | N/A  
| /api/movies/upcoming | Get a list of upcoming movies | N/A | N/A | N/A
| /api/movies/trending | Get a list of trending movies | N/A | N/A | N/A
| /api/genres | Get a list of genres | N/A | N/A | N/A
| /api/users | Get a list of users | Authenticate a user| N/A | N/A
| /api/users?action=register | N/A | Register a user | N/A | N/A
| /api/users/{userid} | N/A | N/A | Update user data | N/A
| /api/users/{userName}/favourites | Get a list of user's favourites | Add a movie as user's favourites | N/A | N/A


## Security and Authentication
Protected Routes:
```bat
/api/users/{userName}/favourites
```
## Integrating with React App
React App Repo Link: https://github.com/jeff-ntl/wad2-moviesApp

Call /api/movies to get a list of movies:
~~~Javascript
export const getMovies = () => {
  return fetch(
     '/api/movies',{headers: {
       'Authorization': window.localStorage.getItem('token')
    }
  }
  )
    .then(res => res.json())
    .then(json => {return json.results;});
};

~~~

## Extra features
Helmet middleware is implemented for better security.
+ This is how it looks like after implementing Helmet
![helmet](./movies-api/public/helmet.png)
+ This link explain what the screenshot below means: https://www.twilio.com/blog/securing-your-express-app-html

## Independent learning.

Mongoose CRUD
+ https://medium.com/@yugagrawal95/mongoose-mongodb-functions-for-crud-application-1f54d74f1b34

Helmet
+ https://helmetjs.github.io/
+ https://www.twilio.com/blog/securing-your-express-app-html


# Assignment 2 - Agile Software Practice.

Name: Teek Leng Ng (W20078325)

## Target Web API.

Overview of your web API design: 

|  |  GET | POST | PUT | DELETE
| -- | -- | -- | -- | -- 
| /api/movies |Gets a list of movies | Create a new movie | N/A | N/A
| /api/movies/{movieid} | Get a Movie | N/A | Update a movie | Delete a movie
| /api/movies/{movieid}/reviews | Get all reviews for movie | N/A | N/A | N/A  
| /api/movies/upcoming | Get a list of upcoming movies | N/A | N/A | N/A
| /api/movies/trending | Get a list of trending movies | N/A | N/A | N/A
| /api/genres | Get a list of genres | N/A | N/A | N/A
| /api/users | Get a list of users | Authenticate a user| N/A | N/A
| /api/users?action=register | N/A | Register a user | N/A | N/A
| /api/users/{userid} | N/A | N/A | Update user data | N/A
| /api/users/{userName}/favourites | Get a list of user's favourites | Add a movie as user's favourites | N/A | N/A

Notes:
+ Post /api/movies - title is required, movie id will be generated randomly from a range of numbers if not provided.
+ Put /api/movies/{movieid} - the request payload includes the some/all of the following movie properties to be updated: title, genre list, release date.
+ Post /api/users - require username and password in the request body for authentication.
+ Post /api/users?action=register - require username and password in the request body for registration.
+ Put /api/users/{userid} - require user properties to be updated in the request body.
+ Get /api/users/{userName}/favourites - require authentication token. Username provided in url must exist in user database.
+ Post /api/users/{userName}/favourites - require movie id in the request body and authentication token in the header. Duplicated movie entry is not allowed. Username provided in url must exist in user database.

## Error/Exception Testing.

Run npm test for more detailed info.
+ Get /api/movies/{movieid} - test if movie id given exists in database.
+ Post /api/movies - test if new movie is provided in the request body.
+ Put /api/movies/{movieid} - test if properties to be updated is provided and the movie exists in the database.
+ Delete /api/movies/{movieid} - test if movie id provided exists in database. 
+ Post /api/users?action=register - test if password given is at least 5 characters long and contain at least 1 number and letter.
+ Post /api/users - test if username provided exists in database and correct password is given.
+ Get /api/users/{userName}/favourites - test if user is authenticated and if the user exists in user database.

## Continuous Delivery/Deployment.

..... Specify the URLs for the staging and production deployments of your web API, e.g.

+ https://movies-api-staging0.herokuapp.com/ - Staging deployment
+ https://movies-api-production0.herokuapp.com - Production deployment

.... Show a screenshots from the overview page for the two Heroku apps e,g,

+ Staging app overview 

![staging-overview](./movies-api/public/staging-overview.png)

+ Production app overview 

![production-overview](./movies-api/public/production-overview.png)

## Independent learning.

Continuous Delivery: Production deployment as a manual job
+ https://docs.gitlab.com/ee/ci/yaml/README.html#when