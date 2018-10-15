const axios = require('axios');
const cheerio = require('cheerio');
const { genres } = require('./genres.js');

const getLinksByGenre = async (genre) => {
  try {
    const searchUrl = `https://www.goodreads.com/genres/${genre}`;
    const html = await axios.get(searchUrl);
    const $ = cheerio.load(html.data);
    const elements = $('.coverWrapper');
    let arr = [];
    elements.each((index, el) => {
      arr.push(el.children[1].attribs.href);
    });
    return arr;
  } catch (err) {
    console.log(err);
  }
};

const getEachBookData = async (endpoint) => {
  try {
    const searchUrl = `https://www.goodreads.com${endpoint}`;
    const html = await axios.get(searchUrl);
    const $ = cheerio.load(html.data);
    const title = $('#bookTitle').text().replace(/\n/g, '').replace(/^\s*/g, '');
    const synopsis = $('#description').children().first().text().replace(/-/g, ' ').replace(/―/g, ' ');
    const vote_avg = $('.average').text();
    const vote_count = $('.count.value-title').text().replace(/\s/g, '').replace(/,/g, '');
    const image = $('#coverImage').attr('src');
    const goodReads_id = endpoint.replace(/[^\d]/g, '');
    return { title, synopsis, vote_avg, vote_count, image, goodReads_id, type: 'book' };
  } catch (err) {
    console.log(err)
  }
};

const scrapeGR = async (genres) => {
  try {
    let timer = 0;
    for (let key in genres) {
      let bookLinks = await getLinksByGenre(genres[key]);
      for (let i = 0; i < bookLinks.length; i++) {
        setTimeout(async () => {
          let bookObj = await getEachBookData(bookLinks[i]);
          axios.post('http://localhost:8081/db/addGoodReadsBook', { bookObj, genre_id: key, name: genres[key] });
        }, 2000 * timer);
        timer++;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const scrapeOneForTesting = async () => {
  try {
    let bookData0 = await getEachBookData('/book/show/2767052-the-hunger-games');
    axios.post('http://localhost:8081/db/addGoodReadsBook', { bookObj: bookData0, genre_id: "28", name: genres["28"] });
    let bookData1 = await getEachBookData('/book/show/2767052-the-hunger-games');
    axios.post('http://localhost:8081/db/addGoodReadsBook', { bookObj: bookData1, genre_id: "10770", name: genres["10770"] });
    let bookData2 = await getEachBookData('/book/show/6148028-catching-fire');
    axios.post('http://localhost:8081/db/addGoodReadsBook', { bookObj: bookData2, genre_id: "28", name: genres["28"] });
    let bookData3 = await getEachBookData('/book/show/6148028-catching-fire');
    axios.post('http://localhost:8081/db/addGoodReadsBook', { bookObj: bookData3, genre_id: "10770", name: genres["10770"] });
  } catch (err) {
    console.log(err);
  }
};

// scrapeOneForTesting();
// scrapeGR(genres);

module.exports.scrapeGR = scrapeGR;