window.onload = function() {
    const container = document.querySelector("main .d-flex"); // onde os cards vão ficar

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`) // pega 20 primeiros
        .then(res => res.json())
        .then(async (dados) => {
            for (let i = 0; i < dados.results.length; i++) {
                let url = dados.results[i].url;

                // pega dados detalhados de cada Pokémon
                let respostaPokemon = await fetch(url);
                let pokemon = await respostaPokemon.json();

                // cria elementos do card
                let card = document.createElement("div");
                card.classList.add("card");
                card.style.width = "18rem";

                let img = document.createElement("img");
                img.classList.add("card-img-top");
                img.src = pokemon.sprites.other["official-artwork"].front_default;
                img.alt = pokemon.name;

                let body = document.createElement("div");
                body.classList.add("card-body");

                let pokedexNum = document.createElement('h5'); 
                pokedexNum.classList.add("pokedex-number");
                pokedexNum.textContent = "#" + pokemon.id.toString().padStart(3, '0');

                let typesDiv = document.createElement("div");
                typesDiv.classList.add("d-flex", "gap-2");

                // tipo 1
                let type01 = document.createElement("span");
                type01.classList.add("type", pokemon.types[0].type.name + "-type");
                type01.textContent = pokemon.types[0].type.name;
                typesDiv.appendChild(type01);

                // tipo 2 (se existir)
                if (pokemon.types[1]) {
                    let type02 = document.createElement("span");
                    type02.classList.add("type", pokemon.types[1].type.name + "-type");
                    type02.textContent = pokemon.types[1].type.name;
                    typesDiv.appendChild(type02);
                }

                // nome
                let name = document.createElement("h3");
                name.classList.add('pokemon-name')
                name.textContent = pokemon.name;

                // monta card
                body.appendChild(pokedexNum)
                body.appendChild(typesDiv);
                body.appendChild(name);
                card.appendChild(img);
                card.appendChild(body);

                // coloca card no container
                container.appendChild(card);
            }
        });
};

let offset = 20;
const limit = 20;

function carregarPokemon() {
    const container = document.querySelector("main .d-flex");

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
        .then(res => res.json())
        .then(async (dados) => {
            for (let i = 0; i < dados.results.length; i++) {
                let url = dados.results[i].url;

                // pega dados detalhados
                let respostaPokemon = await fetch(url);
                let pokemon = await respostaPokemon.json();

                // cria o card
                let card = document.createElement("div");
                card.classList.add("card");
                card.style.width = "18rem";

                let img = document.createElement("img");
                img.classList.add("card-img-top");
                img.src = pokemon.sprites.other["official-artwork"].front_default;
                img.alt = pokemon.name;

                let body = document.createElement("div");
                body.classList.add("card-body");

                let pokedexNum = document.createElement('h5'); 
                pokedexNum.classList.add("pokedex-number");
                pokedexNum.textContent = "#" + pokemon.id.toString().padStart(3, '0');

                let typesDiv = document.createElement("div");
                typesDiv.classList.add("d-flex", "gap-2");

                // tipo 1
                let type01 = document.createElement("span");
                type01.classList.add("type", pokemon.types[0].type.name + "-type");
                type01.textContent = pokemon.types[0].type.name;
                typesDiv.appendChild(type01);

                // tipo 2
                if (pokemon.types[1]) {
                    let type02 = document.createElement("span");
                    type02.classList.add("type", pokemon.types[1].type.name + "-type");
                    type02.textContent = pokemon.types[1].type.name;
                    typesDiv.appendChild(type02);
                }

                // nome
                let name = document.createElement("h3");
                name.classList.add('pokemon-name')
                name.textContent = pokemon.name;
                
                // monta card
                body.appendChild(pokedexNum)
                body.appendChild(typesDiv);
                body.appendChild(name);
                card.appendChild(img);
                card.appendChild(body);

                container.appendChild(card);
            }

            offset += limit; // atualiza o offset para a próxima chamada
        });
}