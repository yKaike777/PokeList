window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();

    document.getElementById('image').setAttribute('src', data.sprites.other["official-artwork"].front_default);

    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const speciesData = await speciesResponse.json();

    const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
    document.getElementById('pokemon-pokedex').textContent = englishEntry ? englishEntry.flavor_text : "Sem entrada disponível";

    var type01 = document.getElementById("first-type");
    type01.classList.add("type", data.types[0].type.name + "-type");
    type01.textContent = data.types[0].type.name;

    if (data.types[1]) {
        var type02 = document.getElementById("second-type");
        type02.classList.add("type", data.types[1].type.name + "-type");
        type02.textContent = data.types[1].type.name;
    } else {
        document.getElementById("second-type").textContent = "";
    }

    document.getElementById('pokemon-name').textContent = data.name;

    pegarFraquezasVantagens(data);

    mostrarEvolucoes(speciesData);
}


async function pegarFraquezasVantagens(data) {
    const tipos = data.types.map(t => t.type.name);

    let multiplicadores = {}; 

    const todosTiposResponse = await fetch("https://pokeapi.co/api/v2/type");
    const todosTiposJSON = await todosTiposResponse.json();
    todosTiposJSON.results.forEach(t => multiplicadores[t.name] = 1);

    for (const tipo of tipos) {
        const tipoResponse = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
        const tipoJSON = await tipoResponse.json();
        const damage = tipoJSON.damage_relations;

        damage.double_damage_from.forEach(t => multiplicadores[t.name] *= 2);

        damage.half_damage_from.forEach(t => multiplicadores[t.name] *= 0.5);

        damage.no_damage_from.forEach(t => multiplicadores[t.name] *= 0);
    }

    let fraquezas = [];
    let resistencias = [];
    let imunidades = [];

    for (const tipo in multiplicadores) {
        const mult = multiplicadores[tipo];
        if (mult === 0) imunidades.push(tipo);
        else if (mult > 1) fraquezas.push(tipo);
        else if (mult < 1) resistencias.push(tipo);
    }

    const listaFraquezas = document.getElementById("fraquezas");
    const listaResistencias = document.getElementById("resistencias");
    const listaImunidades = document.getElementById("imunidades");

    listaFraquezas.innerHTML = fraquezas.map(t => `<span class="${t}-type type">${t}</span>`).join("");
    listaResistencias.innerHTML = resistencias.map(t => `<span class="${t}-type type">${t}</span>`).join("");
    listaImunidades.innerHTML = imunidades.map(t => `<span class="${t}-type type">${t}</span>`).join("");

    
}

async function mostrarEvolucoes(speciesData) {
    const evoResponse = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoResponse.json();

    const evolutionsContainer = document.getElementById("evolutions-area");

    function percorrerChain(chain) {
        const evoDiv = document.createElement("div");
        evoDiv.classList.add("evolution");

        const nomeEvo = chain.species.name;

        fetch(`https://pokeapi.co/api/v2/pokemon/${nomeEvo}`)
            .then(res => res.json())
            .then(pokemonData => {
                const img = document.createElement("img");
                img.src = pokemonData.sprites.front_default;
                img.alt = nomeEvo;
                img.title = nomeEvo
                img.height = 125;
                evoDiv.appendChild(img);
            });

        evolutionsContainer.appendChild(evoDiv);

        if (chain.evolves_to.length > 0) {
            chain.evolves_to.forEach(next => percorrerChain(next));
        }
    }

    percorrerChain(evoData.chain);
}

function search(){
    const input = document.getElementById('search-input').value.toLowerCase()
    window.location.href = `index.html?id=${input}`;
    aplicarFiltros()
}