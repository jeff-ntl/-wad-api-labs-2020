import express from 'express';
import {
  getMovies, getMovie, getMovieReviews, getUpcomingMovies, getTrendingMovies
} from './tmdb-api';
import movieModel from './movieModel';
import { movies } from '../../seedData/movies';


const router = express.Router();

router.get('/', (req, res, next) => {
  movieModel.find().then(movies => res.status(200).send(movies)).catch(next);
});

//Create a new movie
router.post('/', (req, res, next) => {
  let newMovie = req.body;
  if (newMovie && newMovie.title) {
    //Adds a random id if missing. 
    !newMovie.id ? newMovie.id = Math.round(Math.random() * 10000) : newMovie 
    movieModel.create(newMovie).then(res.status(201).send(newMovie)).catch(next);
  } else {
    res.status(405).send({
      message: "Request body is empty.",
      status: 405
    });
  }
});

// Update a movie
router.put('/:id',  (req, res, next) => {
  const reqID = parseInt(req.params.id);

  if(Object.keys(req.body).length === 0){
    res.status(405).send({
      message: "Request body is empty.",
      status: 405
    });
  }
  else{
    let updatedMovie = req.body
    movieModel.exists({ id: reqID }).then(movie => {
      if (updatedMovie._id) delete updatedMovie._id;

      if (movie) {
        movieModel.updateOne({
          id: reqID,
        }, updatedMovie, {
          upsert: false,
        })
        .then(res.status(201).send({message: `Movie ${reqID} updated.`})).catch(next)
      } 
      else {
        res.status(405).send({
          message: "Please provide a valid movie ID.",
          status: 405
        });
      }
    })
  }
  
});

// Delete a movie
router.delete('/:id',  (req, res, next) => {
  const reqID = parseInt(req.params.id);
  movieModel.exists({ id: reqID }).then(movie => {

    if (movie) {
      movieModel.deleteOne({id: reqID})
      .then(res.status(201).send({message: `Movie ${reqID} deleted.`})).catch(next)
    } 
    else {
      res.status(405).send({
        message: "Please provide a valid movie ID.",
        status: 405
      });
    }
  })
});

router.get('/upcoming', (req, res, next) => {
  getUpcomingMovies().then(upcomingMovies => res.status(200).send(upcomingMovies)).catch(next);
});

router.get('/trending', (req, res, next) => {
  getTrendingMovies().then(trendingMovies => res.status(200).send(trendingMovies)).catch(next);
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  movieModel.findByMovieDBId(id).then(movie => res.status(200).send(movie)).catch(next);
});

router.get('/:id/reviews', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieReviews(id)
  .then(reviews => res.status(200).send(reviews))
  .catch((error) => next(error));
});



export default router;