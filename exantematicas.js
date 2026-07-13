const sintomas=[
"Febre",
"Morbiliforme",
"Linfonodomegalias",
"Tosse",
"Coriza",
"Prurido",
"Koplik",
"Conjuntivite",
"Vesículas",
"Palmas",
"Plantas"
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
    name: "Sarampo",
    score: 0,
    weights: {
        "Morbiliforme": 30,
        "Febre": 15,
        "Linfonodomegalias": 20,
        "Tosse": 20,
        "Coriza": 20,
        "Conjuntivite": 20,
        "Koplik": 99,
        "Maculopapular": 20,
        "Face": 20,
        "Cefalocaudal": 30,
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
        "Morbiliforme": 30,
        "Febre": 15,
        "Linfonodomegalias": 20,
        "Tosse": 20,
        "Coriza": 20,
        "Conjuntivite": 20,
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
        "Febre": 10,
        "Linfonodomegalias": 40,
        "Tosse": 20,
        "Coriza": 20,
        "Conjuntivite": 20,
        "Koplik": -150,
        "Maculopapular": 20,
        "Face": 20,
        "Cefalocaudal": 30,
        "Prurido": -10,
        "Palmas": -20,
        "Plantas": -20,
        "Vesículas": -40
    }
},
{
    name: "Varicela",
    score: 0,
    weights: {
        "Febre": 60,
        "Linfonodomegalias": 30,
        "Tosse": 10,
        "Coriza": 10,
        "Conjuntivite": 40,
        "Koplik": -150,
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

    document
        .querySelectorAll("#patient .tag")
        .forEach(tag => patient.push(tag.textContent));

    for(const disease of diseases){

        disease.score = 0;

        for(const feature of patient){

            disease.score += disease.weights[feature] ?? 0;

        }

    }

    diseases.sort((a,b)=>b.score-a.score);

    renderDiagnosis();

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
