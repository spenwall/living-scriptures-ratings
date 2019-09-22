const Cheerio = require('cheerio')
const fs = require('fs')

const scrape = () => {

  const $ = Cheerio.load(fs.readFileSync('video-page.html', 'utf8'))
  const movies = $('.movie-cover')


}

scrape()