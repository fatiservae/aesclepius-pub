//TODO: checkar faixas de idade?
//
// NOTE: sinais patognomônicos devem sempre
// carregar 60% para a doença correspondente
// e penalizar em 40% todas outras.
const sintomas=[
    "Fácies róseas",
    "Adulto jovem",
    "Lesões em alvo",
    "Diarreia",
    "Gengivite",
    "Púrpura",
    "Petéquias",
    "Micropápulas",
    "Dor abdominal",
    "Diarreia",
    "Roséola tífica",
    "Amigdalite",
    "Língua em framboesa", 
    "Febre alta",
    "Febre baixa",
    "Centrífugo",
    "0 a 2 anos",
    "2 a 6 anos",
    "6 a 12 anos",
    "Idoso",
    "Maior de 12 anos",
    "Morbiliforme",
    "Linfonodomegalias",
    "Tosse",
    "Coriza",
    "Prurido",
    "Koplik",
    "Conjuntivite",
    "Vesículas",
    "Palmas",
    "Plantas",
    "Face"
];

let ages = 0;
const pool=document.querySelector("#pool");
const patient=document.querySelector("#patient");

for(const s of sintomas){

    const tag=document.createElement("div");

    tag.className="tag";
    tag.textContent=s;

    pool.appendChild(tag);

    installDrag(tag);

}

function installDrag(tag){
    let offsetX=0;
    let offsetY=0;
    let originalParent=null;
    let nextSibling=null;

    tag.addEventListener("pointerdown",e=>{

        e.preventDefault();

        originalParent=tag.parentNode;
        nextSibling=tag.nextSibling;

        const r=tag.getBoundingClientRect();

        offsetX=e.clientX-r.left;
        offsetY=e.clientY-r.top;

        tag.classList.add("dragging");

        tag.style.position="fixed";
        tag.style.left=r.left+"px";
        tag.style.top=r.top+"px";
        tag.style.width=r.width+"px";

        document.body.appendChild(tag);

        tag.setPointerCapture(e.pointerId);

    });

    tag.addEventListener("pointermove",e=>{

        if(!tag.classList.contains("dragging"))
            return;

        tag.style.left=(e.clientX-offsetX)+"px";
        tag.style.top =(e.clientY-offsetY)+"px";

    });

    tag.addEventListener("pointerup",e=>{

        if(!tag.classList.contains("dragging"))
            return;

        tag.classList.remove("dragging");

        tag.releasePointerCapture(e.pointerId);

        tag.style.position="";
        tag.style.left="";
        tag.style.top="";
        tag.style.width="";

        const elem=document.elementFromPoint(
            e.clientX,
            e.clientY
        );

        const zone=elem?.closest(".zone");

        if(zone){

            zone.appendChild(tag);

        }else{

            if(nextSibling)
                originalParent.insertBefore(tag,nextSibling);
            else
                originalParent.appendChild(tag);

        }
calculateScores(); 
    });
}

const diseases = [
{
  name: "Escarlatina",
  score: 0,
  weights: {
        "Koplik": -40,
        "Micropápulas": 30,
        "Amigdalite": 30,
        "Língua em framboesa": 60, 
  }
},
{
  name: "Doença de Kawasaki",
  score: 0,
  weights: {
        "Koplik": -40,
        "Micropápulas": 20,
        "Língua em framboesa": 50, 
        "Amigdalite": 30,
  }
},
{
  name: "Trombocitopenia idiopática",
  score: 0,
  weights: {
        "Koplik": -40,
        "Fácies róseas": -40, 
        "Púrpura": 30,
        "Petéquias": 30,
        "Febre alta": 20,
        "Diarreia": 20,
        "Gengivite": 20,
        "Dor abdominal": 20,
        "Roséola tífica": -60,
        "Vesículas": -30,
        "Micropápulas": -20,
  }
},
{
  name: "Meningococcemia",
  score: 0,
  weights: {
        "Koplik": -40,
        "Fácies róseas": -20, 
        "Púrpura": 30,
        "Petéquias": 30,
        "Febre alta": 30,
        "Dor abdominal": 20,
        "Roséola tífica": -60,
        "Vesículas": -30,
  }
},{
  name: "Febre tifoide",
  score: 0,
  weights: {
        "Amigdalite": 10,
        "Febre alta": 30,
        "Dor abdominal": 20,
        "Diarreia": 20,
        "Roséola tífica": 60,
        "Koplik": -40,
  }
},
{
  name: "Miliária cristalina",
  score: 0,
  weights: {
        "Koplik": -40,
        "Micropápulas": 20,
        "0 a 2 anos": 30,
        "2 a 6 anos": -20,
        "6 a 12 anos": -20,
        "Idoso": -20,
        "Maior de 12 anos": -20
    }
},
{
  name: "Miliária rubra profunda",
  score: 0,
  weights: {
        "Koplik": -40,
        "Micropápulas": 20,
        "0 a 2 anos": -20,
        "2 a 6 anos": -10,
        "6 a 12 anos": 10,
        "Idoso": 20,
        "Maior de 12 anos": 30
    }
},{
  name: "Mononucleose",
  score: 0,
  weights: {
        "Koplik": -40,
        "Amigdalite": 40,
  }
},
{
  name: "Infecção por adenovírus",
  score: 0,
  weights: {
        "Fácies róseas": 30, 
        "Conjuntivite": 30,
        "Koplik": -40,
  }
},
{
    name: "Sarampo",
    score: 0,
    weights: {
        "Centrífugo": 20,
        "0 a 2 anos": 20,
        "2 a 6 anos": 20,
        "6 a 12 anos": 20,
        "Maior de 12 anos": 10,
        "Morbiliforme": 60,
        "Febre alta": 10,
        "Febre baixa": 10,
        "Linfonodomegalias": 20,
        "Tosse": 20,
        "Coriza": 20,
        "Conjuntivite": 30,
        "Koplik": 60,
        "Maculopapular": 30,
        "Face": 10,
        "Cefalocaudal": -5,
        "Prurido": -10,
        "Palmas": -20,
        "Plantas": -20,
        "Vesículas": -40
    }
},
{
    name: "Eritema infeccioso",
    score: 0,
    weights: {
        "Fácies róseas": 50, 
        "Língua em framboesa": 0, 
        "Centrífugo": 10,
        "0 a 2 anos": 30,
        "2 a 6 anos": 10,
        "6 a 12 anos": 2,
        "Maior de 12 anos": 2,
        "Idoso": -80,
        "Febre alta": 20,
        "Febre baixa": 5,
        "Morbiliforme": 10,
        "Linfonodomegalias": 20,
        "Tosse": 10,
        "Coriza": 20,
        "Conjuntivite": 10,
        "Koplik": -40,
        "Maculopapular": 50,
        "Face": 20,
        "Cefalocaudal": 30,
        "Prurido": -10,
        "Palmas": -20,
        "Plantas": -20,
        "Vesículas": -40
    }
},
{
    name: "Rubéola",
    score: 0,
    weights: {
        "Lesões em alvo": 0,
        "Micropápulas": 20,
        "Língua em framboesa": 0, 
        "0 a 2 anos": 30,
        "2 a 6 anos": 10,
        "6 a 12 anos": 2,
        "Adulto jovem": 20,
        "Idoso": 5,
        "Maior de 12 anos": 2,
        "Febre alta": 10,
        "Febre baixa": 10,
        "Linfonodomegalias": 40,
        "Tosse": 0,
        "Coriza": 20,
        "Conjuntivite": 5,
        "Koplik": -40,
        "Maculopapular": 20,
        "Face": 20,
        "Cefalocaudal": 30,
        "Prurido": -10,
        "Palmas": -20,
        "Plantas": -20,
        "Centrífugo": 10,
        "Vesículas": -40
    }
},
{
    name: "Varicela",
    score: 0,
    weights: {
        "Centrífuga": 20,
        "Morbiliforme": 10,
        "0 a 2 anos": 5,
        "2 a 6 anos": 10,
        "6 a 12 anos": 10,
        "Adulto jovem": 10,
        "Maior de 12 anos": 20,
        "Febre alta": 25,
        "Febre baixa": 10,
        "Linfonodomegalias": 30,
        "Tosse": 5,
        "Coriza": 0,
        "Conjuntivite": 5,
        "Koplik": -40,
        "Centrífugo": 20,
        "Maculopapular": 20,
        "Face": 20,
        "Cefalocaudal": 30,
        "Prurido": 40,
        "Palmas": -20,
        "Plantas": -20,
        "Vesículas": 30
    }
}
];
function calculateScores(){
    const patient = [];
    let test = false;

    document
        .querySelectorAll("#patient .tag")
        .forEach(tag => patient.push(tag.textContent));

    for(const disease of diseases){
        disease.score = 0;
        for(const feature of patient){
            disease.score += disease.weights[feature] ?? 0;

            //TODO: separar exantema do resto dos sintomas?
            if (feature == "Face"
              || feature == "Língua em framboesa" 
              || feature == "Morbiliforme"
              || feature == "Vesículas"
              || feature == "Koplik"
              || feature == "Palmas"
              || feature == "Roséola tífica"
              || feature == "Plantas"
              || feature == "Púrpura"
              || feature == "Micropápulas"
              || feature == "Fácies róseas"
              || feature == "Petéquias"
              || feature == "Centrífugo") {
              test = true
            }

        }
    }

    diseases.sort((a,b)=>b.score-a.score);

    if (test==true) {
      renderDiagnosis();
    } else {
      renderAlert("Selecione algum exantema")
    }

}

function renderAlert(alert) {
    const div=document.querySelector("#diagnoses");
    div.innerHTML=` <div class="diagnosis"> <span>${alert}</span></div>`;
    
}

function renderDiagnosis(){
    const div=document.querySelector("#diagnoses");
    div.innerHTML="";
    for(const disease of diseases){
        if (disease.score <= 0) {
            div.innerHTML+=`
            <div display=none>
            </div>
        `;
        } else {
          if (disease.score > 100) {
            disease.score = 99
          }
        div.innerHTML+=`
            <div class="diagnosis">
                <span>${disease.name}</span>
                <span>${disease.score}%</span>
            </div>
        `;}
    }
}
