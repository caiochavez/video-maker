const algorithmia = require('algorithmia')

function robot (content) {
  fetchContentFromWikipedia(content)
  // sanitizeContent(content)
  // breakContentIntoSentences(content)

  async function fetchContentFromWikipedia (content) {
    const algorithmiaAuthenticated = algorithmia(process.env.API_KEY_ALGORITHMIA)
    const wikipediaAlgorithmia = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
    const wikipediaResponse = await wikipediaAlgorithmia.pipe(content.searchTerm)
    const wikipediaContent = wikipediaResponse.get()
    console.log('wikipediaContent: ', wikipediaContent)
  }

}

module.exports = robot