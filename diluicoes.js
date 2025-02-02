function diluir() {
  let concI = parseFloat(document.getElementById("concI").value);
  let concF = parseFloat(document.getElementById("concF").value);
  let vol = parseFloat(document.getElementById("volF").value);
  let resultado = document.getElementById("resultadoDil");

  if (concF > concI) {
    resultado.innerHTML = "Erro! Concentração final menor que a inicial."
  }

  // Dropdown pra escolher as unidades.
  // c = q/vol
  let q = concF*vol;
  let vAsp = q/concI;
  let volAdd = vol - vAsp;

  console.log(concF, concI, vol, volAdd, q, vAsp);

  resultado.innerText = "Aspire "+vAsp.toFixed(2)+"mL da solução e adicione "+volAdd.toFixed(2)+"mL de diluente.";
}
