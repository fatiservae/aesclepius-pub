const sintomas=[
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
        "Amigdalite": 30,
        "Língua em framboesa": 60, 
  }
},
{
  name: "Doença de Kawasaki",
  score: 0,
  weights: {
        "Língua em framboesa": 50, 
        "Amigdalite": 30,
  }
},
{
  name: "Mononucleose",
  score: 0,
  weights: {
        "Amigdalite": 40,
  }
},
{
  name: "Infecção por adenovírus",
  score: 0,
  weights: {
        "Conjuntivite": 30,
        "Koplik": -90,
  }
},
{
    name: "Sarampo",
    score: 0,
    weights: {
        "Língua em framboesa": 0, 
        "Centrífugo": 30,
        "0 a 2 anos": 20,
        "2 a 6 anos": 30,
        "6 a 12 anos": 20,
        "Idoso": 5,
        "Maior de 12 anos": 20,
        "Morbiliforme": 30,
        "Febre alta": 10,
        "Febre baixa": 10,
        "Linfonodomegalias": 20,
        "Tosse": 20,
        "Coriza": 20,
        "Conjuntivite": 30,
        "Koplik": 99,
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
        "Língua em framboesa": 0, 
        "Centrífugo": 10,
        "0 a 2 anos": 30,
        "2 a 6 anos": 10,
        "6 a 12 anos": 2,
        "Maior de 12 anos": 2,
        "Idoso": -80,
        "Centrífuga": 0,
        "Febre alta": 20,
        "Febre baixa": 5,
        "Morbiliforme": 10,
        "Linfonodomegalias": 20,
        "Tosse": 10,
        "Coriza": 20,
        "Conjuntivite": 10,
        "Koplik": -150,
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
        "Língua em framboesa": 0, 
        "0 a 2 anos": 30,
        "2 a 6 anos": 10,
        "6 a 12 anos": 2,
        "Adulto jovem": 20,
        "Idoso": 5,
        "Maior de 12 anos": 2,
        "Centrífuga": 0,
        "Febre alta": 10,
        "Febre baixa": 10,
        "Linfonodomegalias": 40,
        "Tosse": 0,
        "Coriza": 20,
        "Conjuntivite": 5,
        "Koplik": -150,
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
        "Língua em framboesa": 0, 
        "0 a 2 anos": 0,
        "2 a 6 anos": 10,
        "6 a 12 anos": 2,
        "Adulto jovem": 20,
        "Idoso": 5,
        "Maior de 12 anos": 20,
        "Febre alta": 30,
        "Febre baixa": 10,
        "Linfonodomegalias": 30,
        "Tosse": 5,
        "Coriza": 0,
        "Conjuntivite": 5,
        "Koplik": -90,
        "Centrífugo": 20,
        "Maculopapular": 20,
        "Face": 20,
        "Cefalocaudal": 30,
        "Prurido": 60,
        "Palmas": -20,
        "Plantas": -20,
        "Vesículas": 40
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
              || feature == "Centrífugo"
              || feature == "Morbiliforme"
              || feature == "Koplik"
              || feature == "Palmas"
              || feature == "Plantas"
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
