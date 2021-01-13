import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movies from "../../../../api/movies/movieModel";
const expect = chai.expect;
import sampleMovies from "../../../../seedData/movies"

let db;
let api;

const sampleMovie = {
  id: 337401,
  title: "Mulan",
};

describe("Movies endpoint", () => {
    before(() => {
        mongoose.connect(process.env.mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
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
      console.log(sampleMovies)
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
    it("should return 20 movies and a status 200", (done) => {
      request(api)
        .get("/api/movies")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(20);
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
