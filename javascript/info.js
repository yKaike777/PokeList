let chartInstance;

window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id") || "pikachu"; // default: pikachu

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();

  document.getElementById('image').setAttribute(
    'src',
    data.sprites.other["official-artwork"].front_default
  );

  document.getElementById('pokemon-name').textContent = data.name;

  const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const speciesData = await speciesResponse.json();
  const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
  document.getElementById('pokemon-pokedex').textContent = englishEntry ? englishEntry.flavor_text : "Sem entrada disponível";

  var type01 = document.getElementById("first-type");
  type01.className = "type";
  type01.classList.add(data.types[0].type.name + "-type");
  type01.textContent = data.types[0].type.name;

  if (data.types[1]) {
    var type02 = document.getElementById("second-type");
    type02.className = "type";
    type02.classList.add(data.types[1].type.name + "-type");
    type02.textContent = data.types[1].type.name;
  } else {
    document.getElementById("second-type").textContent = "";
  }

  pegarFraquezasVantagens(data);

  mostrarEvolucoes(speciesData);

  createChart(id);
};


// ----------------- FRAQUEZAS / RESISTÊNCIAS -----------------
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

  document.getElementById("fraquezas").innerHTML = fraquezas.map(t => `<span class="${t}-type type">${t}</span>`).join("");
  document.getElementById("resistencias").innerHTML = resistencias.map(t => `<span class="${t}-type type">${t}</span>`).join("");
  document.getElementById("imunidades").innerHTML = imunidades.map(t => `<span class="${t}-type type">${t}</span>`).join("");
}


// ----------------- EVOLUÇÕES -----------------
async function mostrarEvolucoes(speciesData) {
  const evoResponse = await fetch(speciesData.evolution_chain.url);
  const evoData = await evoResponse.json();

  const evolutionsContainer = document.getElementById("evolutions-area");
  evolutionsContainer.innerHTML = "<h2>Evoluções</h2>";

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
        img.title = nomeEvo;
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


// ----------------- GRÁFICO DE STATUS -----------------
const ctx = document.getElementById("pokemonChart").getContext("2d");

async function getPokemonData(nome) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
  const data = await response.json();

  const labels = data.stats.map(stat => stat.stat.name);
  const values = data.stats.map(stat => stat.base_stat);

  return { labels, values, name: data.name };
}

async function createChart(pokemon) {
  const { labels, values, name } = await getPokemonData(pokemon);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: `Status de ${name}`,
        data: values,
        backgroundColor: "#C5223392",
        borderColor: "#961723",
        borderWidth: 2,
        pointBackgroundColor: "#961723"
      }]
    },
    options: {
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 150
        }
      }
    }
  });
}


// ----------------- SEARCH -----------------
function search() {
  const input = document.getElementById('search-input').value.toLowerCase();
  window.location.href = `info.html?id=${input}`;
}

// ----------------- DROPDOWN -----------------
document.getElementById('gear-icon').onclick = function() {
    const dropdown = document.getElementById('dropdown-box');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
};

document.addEventListener('click', function(e) {
    const gear = document.getElementById('gear-icon');
    const dropdown = document.getElementById('dropdown-box');
    if (!gear.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// ----------------- DARK MODE -----------------
const toggleSwitch = document.querySelector('.form-check-input');
const body = document.body;
const header = document.querySelector('header');
const cards = document.querySelectorAll('.card');
const checkboxes = document.querySelectorAll('.form-check');
const darkModeSwitch = document.getElementById('flexSwitchCheckChecked');

if (darkModeSwitch) {
    darkModeSwitch.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        document.querySelector('header').classList.toggle('dark-mode');
        document.getElementById('stats-container').classList.toggle('dark-mode');
        document.getElementById('pokemon-image').classList.toggle('dark-mode');
    });
}

// ----------------- TAMANHO DA FONTE -----------------
const fontSizeInput = document.querySelector('.font-size-input');
const classes = ['pequeno', 'medio', 'grande'];

function aplicarTamanho(classe){
  document.body.classList.remove(...classes);
  document.body.classList.add(classe);
}

if (fontSizeInput) {
  aplicarTamanho(fontSizeInput.value);
  fontSizeInput.addEventListener('change', () => aplicarTamanho(fontSizeInput.value));
}