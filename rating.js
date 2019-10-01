const Airtable = require("airtable");
const base = new Airtable({ apiKey: "key4VeTEjoa318V75" }).base(
  "appjf3A4Pbisud2Mn"
);
const request = require('request')

const getMovies = () => {
  base("movies")
  .select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 20,
    view: "Grid view"
  })
  .eachPage(
    function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      
      records.forEach(function(record) {
        if (record.get('kind') === 'movie') {
          let movie = search(record.get('title'))
        }
      });
      
      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
    },
    function done(err) {
      if (err) {
        console.error(err);
        return;
      }
    }
    );
  };
  
  const search = (movieTitle) => {
    const tmdbApi = 'ed2b4a57a88f4e723fd482e570c0d050'
    let title = encodeURIComponent(movieTitle)
    let url = `https://api.themoviedb.org/3/search/movie?api_key=ed2b4a57a88f4e723fd482e570c0d050&language=en-US&query=${title}&page=1&include_adult=false`
    console.log(url)
    request(url, (err, res, body) => {
      if (err) console.log(err)
      console.log(body)
    })
}

getMovies()
