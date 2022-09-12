let PokemonsByType = [];

/**
 * Gets the input (name), checks if existent in allPokemonNames array and render results
 *
 */
async function checkInputName() {
  let input = document.getElementById('filter-input-name').value;
  if (isNaN(input) && input.length >= 1) {
    clearFilter();
    let matchingPokemonNames = filterAllPokemonNames(input.toLowerCase());
    if (matchingPokemonNames.length > 0) {
      openFilterResult();
      await renderFilterResultNames(matchingPokemonNames);
    }
  }
  else if (input.length === 0) {
    closeFilterResult();
  }
}

/**
 * Filters allPokemonNames according to the input and returns the matching pokemon names as array.
 *
 * @param {string} input - text entered in the filter field.
 * @returns {array} - array with pokemon names that match the input.
 */
function filterAllPokemonNames(input) {
  return allPokemonNames.filter((name) => name.includes(input));
}

/**
 * Gets the input (type), checks if existent in allPokemonTypes array and render results
 *
 */
async function checkInputType() {
  let input = document.getElementById('filter-input-type').value;
  if (isNaN(input) && input.length >= 1) {
    clearFilter();
    let matchingPokemonNames = filterAllPokemonTypes(input.toLowerCase());
    //console.log(matchingPokemonNames);
    if (matchingPokemonNames.length > 0) {
      openFilterResult();
      await renderFilterResultNames(matchingPokemonNames);
    }
  }
  else if (input.length === 0) {
   
    closeFilterResult();
  }
}

/**
 * Filters allPokemonTypes according to the input and gets the index. Identifies the pokemon name in array allPokemonNames by index. Returns the matching pokemon names as array.
 *
 * @param {string} input - text entered in the filter field.
 * @returns {array} - array with pokemon names that match the input.
 */
function filterAllPokemonTypes(input) {
  for (let i = 0; i < pokemonQuantity; i++) {
    if (allPokemonTypes[i] === input) {
      PokemonsByType.push(allPokemonNames[i]);
    }
  }
  return PokemonsByType;
}

/**
 * Clears previous filter results.
 */
function clearFilter() {
  document.getElementById('filter-result').innerHTML = '';
  PokemonsByType = [];
}

/**
 * Shows the filter result-container and hides the Pokedex.
 */
function openFilterResult() {
  document.getElementById('pokedex').classList.add('d-none');
  ['filter-result'].forEach((element) =>
    document.getElementById(element).classList.remove('d-none')
  );
}

/**
 * Loads the pokemon objects that belong to the pokemon names that match the input and renders the matching pokemons into the filter-result-container.
 *
 * @param {array} matchingPokemonNames - array with the pokemon names that contain the input.
 */
async function renderFilterResultNames(matchingPokemonNames) {
  let filterResultPokemons = await loadMatchingPokemons(matchingPokemonNames);
  filterResultPokemons.forEach((pokemon) => addPokemonCard(pokemon, 'filter-result'));
}

/**
 * Loads the pokemon objects by name and pushes into the array filterResultPokemons.
 *
 * @param {array} matchingPokemonNames - array with the pokemon names that contain the input.
 * @returns {Promise<array>} - array that contains the pokemon objects that match the input.
 */
async function loadMatchingPokemons(matchingPokemonNames) {
  let filterResultPokemons = [];
  let matchingPokemon;
  for (let i = 0; i < matchingPokemonNames.length; i++) {
    matchingPokemon = await getMatchingPokemon(matchingPokemonNames[i]);
    filterResultPokemons.push(matchingPokemon);
  }
  return filterResultPokemons;
}

/**
 * Gets the matching pokemon object, if not yet loaded to loadedPokemons array gets it from the API.
 *
 * @param {string} matchingPokemonName - The name of the currently checked Pokemon.
 * @returns {object} - The pokemon-object corresponging to matchingPokemonName.
 */
async function getMatchingPokemon(matchingPokemonName) {
  let matchingPokemon = getPokemonObject(matchingPokemonName);
  if (!matchingPokemon) {
    matchingPokemon = await getPokemon(matchingPokemonName);
  }
  return matchingPokemon;
}

/**
 * Shows the pokedex and hides the filter result-container.
 */
function closeFilterResult() {
  document.getElementById('pokedex').classList.remove('d-none');
  ['filter-result'].forEach((element) =>
    document.getElementById(element).classList.add('d-none')
  );
  document.getElementById('filter-input-name').value = '';
  document.getElementById('filter-input-type').value = '';
}