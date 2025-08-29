const input = document.getElementById("search-input");
const tipoCheckboxes = document.querySelectorAll("#filtro-tipos input[type=checkbox]");

function aplicarFiltros() {
    const filtroNome = input.value.toLowerCase();

    const tiposSelecionados = Array.from(tipoCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());

    const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const nameEl = card.querySelector(".pokemon-name");
    if (!nameEl) return;

    const nomePokemon = nameEl.innerText.toLowerCase();
    const tiposCard = card.getAttribute("data-types").toLowerCase().split(",");

    const bateNome = nomePokemon.includes(filtroNome);

    const bateTipo =
      tiposSelecionados.length === 0 ||
      tiposSelecionados.some(t => tiposCard.includes(t));

      card.style.display = (bateNome && bateTipo) ? "block" : "none";
  });
}

input.addEventListener("input", aplicarFiltros);
tipoCheckboxes.forEach(cb => cb.addEventListener("change", aplicarFiltros));

