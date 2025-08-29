window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    document.getElementById('search-input').value = id

    const container = document.querySelector("#pokemon-container");

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1010&offset=0`);
    const dados = await res.json();

    for (let i = 0; i < dados.results.length; i++) {
      const url = dados.results[i].url;
      const respostaPokemon = await fetch(url);
      const pokemon = await respostaPokemon.json();

      criarCard(pokemon, container);
    }
};

function criarCard(pokemon, container) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.width = "18rem";

    card.setAttribute("data-types", pokemon.types.map(t => t.type.name).join(","));

    const img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = pokemon.sprites.other["official-artwork"].front_default;
    img.alt = pokemon.name;

    const body = document.createElement("div");
    body.classList.add("card-body");

    const pokedexNum = document.createElement('h5');
    pokedexNum.classList.add("pokedex-number");
    pokedexNum.id = pokemon.id
    pokedexNum.textContent = "#" + pokemon.id.toString().padStart(3, '0');

    const typesDiv = document.createElement("div");
    typesDiv.classList.add("d-flex", "gap-2");

    const type01 = document.createElement("span");
    type01.classList.add("type", pokemon.types[0].type.name + "-type");
    type01.textContent = pokemon.types[0].type.name;
    typesDiv.appendChild(type01);

    if (pokemon.types[1]) {
      const type02 = document.createElement("span");
      type02.classList.add("type", pokemon.types[1].type.name + "-type");
      type02.textContent = pokemon.types[1].type.name;
      typesDiv.appendChild(type02);
    }

    const name = document.createElement("h3");
    name.classList.add("pokemon-name");
    name.textContent = pokemon.name;

    body.appendChild(pokedexNum);
    body.appendChild(typesDiv);
    body.appendChild(name);
    card.appendChild(img);
    card.appendChild(body);

    container.appendChild(card);

    card.addEventListener('click', () => {
      const pokemonID = pokemon.id
      window.location.href = `info.html?id=${pokemonID}`;
    });
}