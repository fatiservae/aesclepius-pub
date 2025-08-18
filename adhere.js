function adhere() {
    let bun = document.getElementById("bun").value;
    let pa = document.getElementById("pa").value;
    let cr = document.getElementById("cr").value;
    let resultado = document.getElementById("resultadoADHERE");
    let risk = ["risco", 0];
    let buttonCopiarADHERE = document.getElementById("buttonCopiarADHERE");
    console.log(bun);

    if ( bun < 1 || 
        pa < 50 || 
        cr < 0.05 ){ 
        resultado.innerHTML = "Erro: algum valor absurdo?";
        return
    }

    if (bun < 43){
        if (pa < 115) {
            risk = ["intermediário", 5.49];
        } else {
            risk = ["baixo", 2.14];
        }
    } else {
        if (pa < 115) {
            if (cr < 2.75) {
                risk = ["intermediário", 12.42];
            } else {
                risk = ["alto", 21.94];
            }
        } else {
            risk = ["intermediário", 6.41];
        }
    };

    resultado.innerHTML = "O risco de mortalidade intrahospitalar deste paciente é "+risk[0]+" e gira em torno de "+risk[1]+"%.";

    buttonCopiarADHERE.style.display = "block";

}

function copiarADHERE() {
    let resultado = document.getElementById("resultadoADHERE");
    const text = resultado.textContent;
    navigator.clipboard.writeText(text);
    //alert('Texto copiado para a área de transferência!');
}
