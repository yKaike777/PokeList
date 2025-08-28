window.onload = async function() {
    fetch(`https://pokeapi.co/api/v2/pokemon/1`).then((response) => response.json()).then(async (data) => {
        document.getElementById('image').setAttribute('src', data.sprites.other["official-artwork"].front_default)


        let type01 = document.getElementById("first-type");
        type01.classList.add("type", data.types[0].type.name + "-type");
        type01.textContent = data.types[0].type.name;
        if (data.types[1]) {
            let type02 = document.getElementById("second-type");
            type02.classList.add("type", data.types[1].type.name + "-type");
            type02.textContent = data.types[1].type.name;
        }
    
        document.getElementById('pokemon-name').textContent = data.name

    })
}