const algorithmia = require('algorithmia')
const sentenceBoundaryDetection = require('sbd')

const NaturalLanguageUnderstandingv1 = require('watson-developer-cloud/natural-language-understanding/v1')
let nlu = new NaturalLanguageUnderstandingv1({
  iam_apikey: process.env.API_KEY_WATSON,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})

async function robot (content) {

  await fetchContentFromWikipedia(content)
  sanitizeContent(content)
  breakContentIntoSentences(content)
  limitMaximumSentences(content)
  await fetchKeywordsOfAllSenteces(content)

  async function fetchContentFromWikipedia (content) {
    const algorithmiaAuthenticated = algorithmia(process.env.API_KEY_ALGORITHMIA)
    const wikipediaAlgorithmia = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
    const wikipediaResponse = await wikipediaAlgorithmia.pipe(content.searchTerm)
    const wikipediaContent = wikipediaResponse.get()
    content.sourceContentOriginal = wikipediaContent.content
  }

  function sanitizeContent (content) {
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
    const withoutDatesInParenteses = removeDatesInParenteses(withoutBlankLinesAndMarkdown)
    content.sourceContentSanitized = withoutDatesInParenteses

    function removeBlankLinesAndMarkdown(text) {
      const allLines = text.split('\n')
      const withoutBlankLinesAndMarkdown = allLines.filter(line => {
        if ( line.trim().length === 0 || line.trim().startsWith('=') ) return false
        return true
      })
      return withoutBlankLinesAndMarkdown.join(' ')
    }

    function removeDatesInParenteses (text) {
      return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
    }
  }

  function breakContentIntoSentences (content) {
    content.sentences = []
    const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
    sentences.forEach(sentence => {
      content.sentences.push({ text: sentence, keywords: [], images: [] })
    })
  }

  function limitMaximumSentences (content) {
    content.sentences = content.sentences.slice(0, content.maximumSentences)
  }

  async function fetchKeywordsOfAllSenteces (content) {
    for (let sentence of content.sentences) {
      sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
    }
  }

  async function fetchWatsonAndReturnKeywords (sentence) {
    return new Promise((resolve, reject) => {
      nlu.analyze({
        text: sentence,
        features: {
          keywords: {}
        }
      }, (error, response) => {
        if (error) throw error
        const keywords = response.keywords.map(keyword => keyword.text)
        resolve(keywords)
      })
    })
  }

}

module.exports = robot