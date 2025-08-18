function calcularTuboPed() {
  let idade = parseInt(document.getElementById("idadeTuboPed").value);
  let altura = parseFloat(document.getElementById("altura").value);
  let sexo = parseInt(document.getElementById("sexo").value);
  let tubo;
  let fatorTubo = 4;

  if (document.getElementById("comCuff").checked ||
        idade > 10) {
      fatorTubo = 3.5;
  } 

  if (idade <= 1) {
      tubo = 3;
  } else if (idade <= 10){
      tubo = idade/4 + fatorTubo;
  } else if (idade > 10) {
      if (altura <= 1.6){
            tubo = 6;
        } else if (altura <= 1.8){
        if (sexo) {
            tubo = 7;
        }else {
            tubo = 6;
        }
      } else if (altura > 1.8){
         tubo = 8;
      }
  }

  let fixacaoTuboPed = tubo*3;
  document.getElementById("resultadoTuboPed").innerHTML = "Considere usar o tubo no. "+tubo.toFixed(0)+"<br>Inserir o tubo aproximadamente "+fixacaoTuboPed+"cm";
  
console.log(tubo)
}

