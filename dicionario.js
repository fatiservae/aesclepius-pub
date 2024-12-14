document.addEventListener("DOMContentLoaded", () => {
  const searched = document.getElementById('search-output');
  const search = document.getElementById("search");

  // A variável searched deve ser incrementada com os 
  // dados que vão sofrer a busca.
  // O exemplo abaixo alimenta searched com dados de 
  // um JSON. Outras formas incluem manipulação do DOM
  // ou dados raw.
  //
  fetch('/dicionario.json')
  .then(response => response.json())
  .then(data => {
    for (let key in data) {
      const listItem = document.createElement('li');
      listItem.innerHTML = "<span style=\"color: var(--corTermo)\">"+key+"</span>"+": "+data[key]; 
      searched.appendChild(listItem);
    }
  })
  .catch(error => console.error('Erro no fetch JSON:', error));
})

// Motor de busca
// O motor trabalha em cima de "searched" tornando
// invisível as entradas não compatíveis com a busca.
search.addEventListener("input", () => {
  const searchText = search.value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, "");
  const searchTerms = searchText.split(" ");
  const hasFilter = searchText.length > 0;
  document.querySelectorAll("#search-output li").forEach(out => {
    const searchString = `${out.innerText}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, ""); 
    let isMatch = searchTerms.every(
      term => searchString.includes(term)
    );
    if (!isMatch && hasFilter){
      out.style.display = 'none'
      //out.classList.remove('show')
    }else{
      out.style.display = 'block'
      //out.classList.add('show')
    }
  })


  // limpar com ESC
  // tem q ser em último
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      document.querySelectorAll("#artlist li").forEach(out => {
        out.style.display = 'none'
      })
    }
  });
})
//function fechardialogo() {
//  let aviso = document.getElementById("aviso");
//  aviso.style.display = 'none'
//};
