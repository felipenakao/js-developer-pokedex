const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;


function showDetails(number) {
    const url = `https://pokeapi.co/api/v2/pokemon/${number}`;
    const pokemon = { url };

    closePokemonDetailModal();

    setTimeout(() => pokeApi.getPokemonDetail(pokemon)
    .then((details) => mountPokemonDetailModal(details))
    .then(showPokemonDetailModal), 300)
}

function closePokemonDetailModal() {
    document.getElementById('pokemonModal').removeAttribute('open')
}

function showPokemonDetailModal() {
    document.getElementById('pokemonModal').setAttribute('open', true)
}

function mountPokemonDetailModal(pokemon) {
    const modal = document.getElementById('pokemonModal')
    modal.innerHTML = `
        <section class="modal-content">
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <h2>${pokemon.name} <span class="number">#${pokemon.number}</span></h2>
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>

            <ul class="stats">
                ${pokemon.stats.map((stat) => `<li>${stat.text}: ${stat.value}</li>`).join('')}
            </ul>
        </section>

        <button onclick="closePokemonDetailModal()" class="close">X</button>
    `
}

function convertPokemonToLi(pokemon) {
    return `
        <li onclick="showDetails('${pokemon.number}')" class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})