function diluir() {
  let concI = parseFloat(document.getElementById("concI").value);
  let concF = parseFloat(document.getElementById("concF").value);
  let vol = parseFloat(document.getElementById("volF").value);
  let resultado = document.getElementById("resultadoDil");

  // Verificação de erro não funciona...
  if (concF > concI) {
    resultado.innerHTML = "Erro! Concentração final menor que a inicial."
    return
  } else if (concF.isNaN() || concI.isNaN() || vol.isNaN()) {
    resultado.innerHTML = "Verifique os valores informados!";
    return
  }

  // Dropdown pra escolher as unidades.
  // c = q/vol
  let q = concF*vol;
  let vAsp = q/concI;
  let volAdd = vol - vAsp;

  console.log(concF, concI, vol, volAdd, q, vAsp);

  resultado.innerHTML = "Aspire "+vAsp.toFixed(2)+"mL da solução e adicione "+volAdd.toFixed(2)+"mL de diluente.";
}

function dosar() {
  let massa = parseFloat(document.getElementById("massaDose").value);
  let intervalo = parseInt(document.getElementById("intervalo").value);
  let dose = parseFloat(document.getElementById("dose").value);
  let apresentacaoQtd = parseFloat(document.getElementById("apresentacaoQtd").value);
  let apresentacaoVol = parseFloat(document.getElementById("apresentacaoVol").value);
  let resultadoDosar = document.getElementById("resultadoDosar");

  if (massa>200 || massa<1) {
    resultadoDosar.innerHTML = "Verifique a massa do paciente!";
    return
  } else if (!dose || isNaN(dose)) {
    resultadoDosar.innerHTML = "Insira alguma dose válida!";
    return
  } else if (!apresentacaoQtd || isNaN(apresentacaoQtd) || !apresentacaoVol || isNaN(apresentacaoVol)) {
    resultadoDosar.innerHTML = "A apresentação não pode ser zero.";
    return
  }

  let total = (massa * dose * apresentacaoVol)/(apresentacaoQtd);
  intervalo = 24/intervalo;
  let doseIntervalo = total/intervalo;

  resultadoDosar.innerHTML = "A dose total diária é de "+total.toFixed(2)+"ml. <br>Devem ser administrados "+doseIntervalo.toFixed(2)+"ml a cada "+intervalo+"h";
}
