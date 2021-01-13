import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movies from "../../../../api/movies/movieModel";
const expect = chai.expect;

let db;
let api;
//to read mongodb connection from env file 
require('dotenv').config()

const sampleMovie = {
  id: 337401,
  title: "Mulan",
};

const sampleMovies = [
  {
      "adult": false,
      "backdrop_path": "/jeAQdDX9nguP6YOX6QSWKDPkbBo.jpg",
      "genre_ids": [
          28,
          14,
          878
      ],
      "id": 590706,
      "original_language": "en",
      "original_title": "Jiu Jitsu",
      "overview": "Every six years, an ancient order of jiu-jitsu fighters joins forces to battle a vicious race of alien invaders. But when a celebrated war hero goes down in defeat, the fate of the planet and mankind hangs in the balance.",
      "popularity": 2633.943,
      "poster_path": "/eLT8Cu357VOwBVTitkmlDEg32Fs.jpg",
      "release_date": "2020-11-20",
      "title": "Jiu Jitsu",
      "video": false,
      "vote_average": 5.9,
      "vote_count": 111
  },
  {
    "adult": false,
    "backdrop_path": "/qAKvUu2FSaDlnqznY4VOp5PmjIF.jpg",
    "genre_ids": [
        28,
        12,
        18,
        14
    ],
    "id": 337401,
    "original_language": "en",
    "original_title": "Mulan",
    "overview": "When the Emperor of China issues a decree that one man per family must serve in the Imperial Chinese Army to defend the country from Huns, Hua Mulan, the eldest daughter of an honored warrior, steps in to take the place of her ailing father. She is spirited, determined and quick on her feet. Disguised as a man by the name of Hua Jun, she is tested every step of the way and must harness her innermost strength and embrace her true potential.",
    "popularity": 1104.142,
    "poster_path": "/aKx1ARwG55zZ0GpRvU2WrGrCG9o.jpg",
    "release_date": "2020-09-04",
    "title": "Mulan",
    "video": false,
    "vote_average": 7.2,
    "vote_count": 3241
  }
]

describe("Movies endpoint", () => {
    before(() => {
        mongoose.connect(process.env.mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        db = mongoose.connection;
        });

        after(async () => {
        try {
            await db.dropDatabase();
        } catch (error) {
            console.log(error);
        }
        });
  beforeEach(async () => {
    try {
      api = require("../../../../index");
      await Movies.deleteMany({});
      await Movies.collection.insertMany(sampleMovies);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
    delete require.cache[require.resolve("../../../../index")];
  });
  describe("GET /movies ", () => {
    it("should return 2 movies and a status 200", (done) => {
      request(api)
        .get("/api/movies")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(2);
          const result = res.body.map((movie) => movie.title);
                expect(result).to.have.members([
                  "Jiu Jitsu",
                  "Mulan",
                ]);
          done();
        });
    });
  });

  describe("GET /movies/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie", () => {
        return request(api)
          .get(`/api/movies/${sampleMovie.id}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("title", sampleMovie.title);
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/movies/xxx")
          .set("Accept", "application/json")
          .expect("Content-Type", /html/)
          .expect(500)
      });
    });
  });
});
