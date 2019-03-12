const readline = require('readline-sync')

function start () {
  const content = {}
  content.searchTerm = askAndReturnSearchTerm()
  function askAndReturnSearchTerm () {
    return readline.question('Digite um termo de pesquisa da Wikipédia: ')
  }
  console.log('Content: ', content)
}

start()