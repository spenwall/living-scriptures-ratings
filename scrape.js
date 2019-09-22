const Cheerio = require('cheerio')
const fs = require('fs')

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

  
  

}

scrape()