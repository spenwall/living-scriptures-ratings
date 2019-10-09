const Airtable = require("airtable");
const base = new Airtable({ apiKey: "key4VeTEjoa318V75" }).base(
  "appjf3A4Pbisud2Mn"
);
const request = require('request')

const getMovies = () => {
  base("movies")
  .select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 500,
    pageSize: 40,
    view: "Grid view",
    filterByFormula: "({tmdb_popularity} = '')",
  })
  .eachPage(
    function page(records, fetchNextPage) {
      // This function\ (`page`) will get called for each page of records.
      
      records.forEach(function(record) {
        if (record.get('kind') === 'movie') {
          search(record.get('title'), record.id)
        }
      });
      
      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      setTimeout(fetchNextPage, 10500)
    },
    function done(err) {
      if (err) {
        console.error(err)
        return;
      }
    }
  );
};
  
const search = (movieTitle, recordId) => {
  const tmdbApi = 'ed2b4a57a88f4e723fd482e570c0d050'
  let title = encodeURIComponent(movieTitle)
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApi}&language=en-US&query=${title}&page=1&include_adult=false`
  request(url, (err, res, body) => {
    if (err) console.log(err)
    let results = JSON.parse(body)
    if (results.results.length) {
      storeResults(results.results[0], recordId)
    }
  })
}

const storeResults = (result, recordId) => {
  base('movies').update([
    {
      "id": recordId,
      "fields": {
        "tmdb_popularity": result.popularity,
        "tmdb_vote_count": result.vote_count,
        "tmdb_poster_path": 'https://image.tmdb.org/t/p/w500' + result.poster_path,
        "tmdb_id": result.id,
        "tmdb_genre_ids": JSON.stringify(result.genre_ids),
        "tmdb_title": result.title,
        "tmdb_vote_average": result.vote_average,
        "tmdb_release_date": result.release_date,
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err)
      return
    }
  })
}

getMovies()
