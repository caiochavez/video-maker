const readline = require('readline-sync')

function robot (content) {

  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()

  function askAndReturnSearchTerm () {
    return readline.question('Digite um termo de pesquisa da Wikipédia: ')
  }
  
  function askAndReturnPrefix () {
    const prefixes = [ 'Quem é', 'O que é', 'A história de' ]
    const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Escolha uma opção: ')
    const selectedPrefixText = prefixes[selectedPrefixIndex]
    return selectedPrefixText
  }

}

module.exports = robot