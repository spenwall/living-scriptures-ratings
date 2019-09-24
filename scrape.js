const Cheerio = require('cheerio')
const fs = require('fs')
const Airtable = require('airtable')
const base = new Airtable({apiKey: 'key4VeTEjoa318V75'}).base('appjf3A4Pbisud2Mn');

const scrape = () => {

  const $ = Cheerio.load(fs.readFileSync('video-page.html', 'utf8'))
  const movies = $('.movie-cover')

  movieInfo = []
  movies.each((i, movie) => {
    movieInfo.push({
      title:  $(movie).attr('data-item-title'),
      kind: $(movie).attr('data-item-kind'),
      id: $(movie).attr('data-item-id'),
      duration: $(movie).attr('data-item-duration'),
      series: $(movies).attr('data-item-series'),
      description: $(movie).attr('data-item-description'),
      rating: $(movie).attr('data-item-content-rating'),
      href: $(movie).attr('data-item-href'),
    })
  })

  movieInfo.forEach((movie) => {
    store(movie)
  })
}

const store = (movie) => {

  base('movies').select({
    view: "Grid view",
    filterByFormula: `({id} = ${movie.id})`
  }).firstPage((err, records) => {
    if (err) { console.error(err); return; }
    if (records.length) {
      console.log('found a record')
      update(records[0].id, movie)   
      return
    }
      create(movie)      
    })
}

const create = (movie) => {

  base('movies').create([{fields: movie}], (err, records) => {
    if (err) {
      console.error(err); return;
    }
    records.forEach((record) => {
      console.log(record.getId())
    })
  })
}

const update = (id, movie) => {
  base('movies').update([
    {
      id: id,
      fields: movie,
    }
  ], (err, records) => {
    if (err) {
      console.error(err); return;
    }
    records.forEach((record) => {
      console.log(record.get('id'))
    })
  })
}

scrape()