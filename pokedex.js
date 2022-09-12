let allPokemonNames = [];
let allPokemonTypes = [];
let loadedPokemons = [];
let pokedexIndex = 0;
let pokemonQuantity = 1118;


/* -------------------  LOAD POKEMON INFORMATION  --------------------- */

/**
 * Calls function to load pokemon names
 */
function init() {
  loadAllPokemonNames();
}

/**
 * Loads pokemon names from API and push into array allPokemonNames.
 */
async function loadAllPokemonNames() {
  let url = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=1118';
  let response = await fetch(url);
  response = await response.json();
  response.results.forEach((pokemon) => allPokemonNames.push(pokemon.name));
  loadPokemon();
}

/**
 * Loads pokemons to the Pokedex.
 */
async function loadPokemon() {
  document.getElementById('filter-input-name').value = '';
  document.getElementById('filter-input-type').value = '';
  for (let i = 0; i < pokemonQuantity; i++) {
    let currentPokemon = await getPokemon();
    loadedPokemons.push(currentPokemon);
    addPokemonCard(currentPokemon, 'pokedex');
    pokedexIndex++;
  }
}

/**
 * Gets the current pokemon object to be shown in pokedex or in filter-result according to input (pokemon name). Checks if the current pokemon has been loaded to Pokemons array and if not, gets it from the API.
 *
 * @returns {object} - The object of the pokemon that currently will be rendered.
 */
async function getPokemon() {
  let pokemonName = allPokemonNames[pokedexIndex];
  let currentPokemon = getPokemonObject(pokemonName);
  if (!currentPokemon) {
    currentPokemon = await getPokemonAPI(pokemonName);
  }
  return currentPokemon;
}

/**
 * Checks if loadedPokemons array includes a pokemon object by name and returns it.
 *
 * @param {string} pokemonName - name of the current pokemon.
 * @returns {object} - object of the current pokemon.
 */
function getPokemonObject(pokemonName) {
  return loadedPokemons.find((pokemon) => pokemon.name === pokemonName);
}

/**
 * Gets the current pokemon object from the API according to current pokemon name.
 *
 * @param {string} pokemonName - name of current pokemon.
 * @returns {object} - current pokemon object.
 */
async function getPokemonAPI(pokemonName) {
  let url = `https://pokeapi.co/api/v2/pokemon/` + pokemonName;
  let response = await fetch(url);
  let currentPokemon = await response.json();
  return currentPokemon;
}


/* -----------------  RENDER POKEMON INFORMATION ------------------ */

let activeFlap;

/**
 * Adds current pokemon card to be rendered.
 *
 * @param {object} currentPokemon - pokemon to be rendered.
 * @param {string} renderContainer - container where current pokemon should be rendered.
 */
function addPokemonCard(currentPokemon, renderContainer) {
  renderPokemonCard(currentPokemon, renderContainer);
  renderPokemonType(currentPokemon, renderContainer);
}

/**
 * Renders current pokemon card.
 *
 * @param {object} currentPokemon - pokemon to be rendered.
 * @param {string} renderContainer - container where current pokemon should be rendered.
 */
function renderPokemonCard(currentPokemon, renderContainer) {
  let pokemonName = currentPokemon['name'];
  let pokemonImg = getPokemonImage(currentPokemon);
  document.getElementById(renderContainer).insertAdjacentHTML('beforeend',
    `<div id="${pokemonName}-${renderContainer}" onclick="openPokemon('${pokemonName}','${renderContainer}')" class="pokedex-card">
      <h1 id="pokename-${pokemonName}-${renderContainer}" class="pokename">${pokemonName}</h1>
      <div id="types-${pokemonName}-${renderContainer}" class="wrap"></div>
      <img class="pokedex-img" src="${pokemonImg}">
    </div>`);
}

/**
 * Gets the image of the pokemon that is beeing rendered.
 */
function getPokemonImage(currentPokemon) {
  let pokemonImg = currentPokemon['sprites']['other']['official-artwork']['front_default'];
  if (pokemonImg) {
    return pokemonImg;
  } else {
    return '';
  }
}

/**
 * Renders current pokemon types and sets the background color.
 * 
 * @param {object} currentPokemon - pokemon that will be rendered.
 * @param {string} renderContainer - container in which the currentPokemon will be rendered.
 */
function renderPokemonType(currentPokemon, renderContainer) {
  let pokemonType = getPokemonType(currentPokemon);
  allPokemonTypes.push(pokemonType);
  let pokemonName = currentPokemon['name'];
  let bg = pokemonName + '-' + renderContainer;
  let type = 'types-' + pokemonName + '-' + renderContainer;
  document.getElementById(bg).classList.add('bg-' + pokemonType);
  document.getElementById(type).innerHTML += `<span class="poketype">${pokemonType}</span>`;
}

/**
 * Gets the types of the pokemon that is beeing rendered.
 */
function getPokemonType(currentPokemon) {
  return currentPokemon['types'][0]['type']['name'];
}


/* ---------------  SELECTED POKEMON INFORMATION  --------------- */

/**
 * Opens selected pokemon card with details
 *
 * @param {string} pokemonName - The name of the selected Pokemon.
 */
function openPokemon(pokemonName) {
  let selectedPokemon = getPokemonObject(pokemonName);
  let pokemonImg = getPokemonImage(selectedPokemon);
  document.getElementById('selected-pokemon-bg').classList.remove('d-none');
  document.getElementById('selected-pokemon-img').src = pokemonImg;
  document.getElementById('selected-pokemon-h1').innerHTML = selectedPokemon['name'];
  document.body.style.overflowY = 'hidden';
  openPokemonType(selectedPokemon);
  openPokemonDetails(selectedPokemon);
}

/**
 * Opens pokemon type in the tables.
 *
 * @param {object} selectedPokemon
 */
function openPokemonType(selectedPokemon) {
  let pokemonType = getPokemonType(selectedPokemon, 'pokemon-card-title');
  let id = 'selected-pokemon-types';
  document.getElementById(id).innerHTML += `<span class="poketype">${pokemonType}</span>`;
  let bg = `var(--bg-${pokemonType})`;
  document.getElementById('pokemon-card-title').style.background = bg;
}

/**
 * Opens pokemon details in the tables
 *
 * @param {object} selectedPokemon
 */
function openPokemonDetails(selectedPokemon) {
  aboutTable(selectedPokemon);
  statsTable(selectedPokemon);
}

/**
 * Fills the tables in the about-flap with information.
 *
 * @param {object} selectedPokemon - object of selected pokemon
 */
function aboutTable(selectedPokemon) {
  getSpecies(selectedPokemon);
  getSize(selectedPokemon);
  getAbilities(selectedPokemon);
}

async function getSpecies(selectedPokemon) {
  let url = selectedPokemon.species.url;
  let response = await fetch(url);
  response = await response.json();
  let species = response['genera'][7]['genus'];
  document.getElementById('species').innerHTML = species;
}

function getSize(selectedPokemon) {
  document.getElementById('weight').innerHTML = selectedPokemon.weight / 10 + ' kg';
  document.getElementById('height').innerHTML = selectedPokemon.height / 10 + ' m';
}

function getAbilities(selectedPokemon) {
  selectedPokemon.abilities.forEach((ability) => {
    let abilityName = ability.ability.name;
    document.getElementById('abilities').innerHTML += abilityName + `; `;
  });
}

/**
 * Fills the table in the base-stats-flap with information.
 *
 * @param {object} selectedPokemon - object of selected pokemon.
 */
function statsTable(selectedPokemon) {
  let total = 0;
  let data = Array.from(document.getElementsByClassName('stat-table-td'));
  for (let i = 0; i < 6; i++) {
    let stat = selectedPokemon['stats'][i]['base_stat'];
    data[i].innerHTML = stat;
    total += stat;
  }
  document.getElementById('total').innerHTML = total;
}

/* Toggles between the selected pokemon detail flaps.
 *
 * @param {string} selectedFlap - id of selected flap.
 */
function showDetails(selectedFlap) {
  if (selectedFlap != activeFlap) {
    Array.from(document.getElementsByClassName('pokemon-flap')).forEach((flap) => flap.classList.toggle('active-flap'));
    Array.from(document.getElementsByTagName('table')).forEach((table) => table.classList.toggle('d-none'));
    activeFlap = selectedFlap;
  }
}

/**
 * Closes selected pokemon card
 *
 */
function closePokemon() {
  document.getElementById('selected-pokemon-bg').classList.add('d-none');
  document.body.style.overflowY = 'visible';
  ['selected-pokemon-types', 'species', 'abilities'].forEach(
    (element) => (document.getElementById(element).innerHTML = '')
  );
  document.getElementById('pokemon-card-title').style.background = '';
}

