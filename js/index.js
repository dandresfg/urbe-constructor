let trimestres = [];
let materias = Array.from({length: 12}, () => []);

// Change Trimestre
document.getElementById('trimestres').addEventListener('change', onChangeTrimestre);
function onChangeTrimestre(evt){
    document.getElementById('materias').innerHTML = trimestres[evt.target.value-1].reduce((acc, materia, index) => {
        return acc+=`<option value="${index}">${materia.name} (${materia.uc} UC)</option>`
    }, '')
}

// Change Cursando
document.getElementById('cursando').addEventListener('change', onChangeCursando);
document.getElementById('terminada').addEventListener('change', onChangeCursando);
function onChangeCursando(evt){
    const value = evt.target.value;
    if(value == 0){
        document.getElementById('nota').style.display = "none"
    } else {
        document.getElementById('nota').style.display = "flex"
    }
}

// On load
window.addEventListener('load', onLoadData)
function onLoadData(){
    trimestres = [...data];
    onChangeTrimestre({ target: {value: 1} })
    onChangeCursando({ target: {value: 0} })
}

// On Submit
document.getElementById('form').addEventListener('submit', onSubmit)
function onSubmit(evt){
    evt.preventDefault();
    onAddMateria()
};

// on Add Materia
function onAddMateria(){
    let materia = document.getElementById('materias').value;
    let index = document.getElementById('trimestres').value - 1;
    let terminada = +document.querySelector('input[name="cursando"]:checked').value;
    let nota = null;

    if(terminada){
        nota = +document.getElementById('inputnota').value;
        if(!(nota > 0 && nota < 21)){
            alert('La nota no es valida');
            return;
        }
    }

    if(trimestres[index][materia]){
        materias[index].push({...trimestres[index][materia], terminada, nota});
        delete trimestres[index][materia];
        onChangeTrimestre({ target: {value: index+1} });
        onUpdateTable();

        document.getElementById('inputnota').value = ''
    } else {
        alert('No tiene materias disponibles')
    }
}

function onUpdateTable(){
    // Lo ordeno verticalmente
    const array = Array.from({length: 12}, () => []);
    for(let index = 0; index < materias.length; index++){
        const trimestre = materias[index];
        for(let i = 0; i < trimestre.length; i++){
            array[i][index] = materias[index][i];
        }
    }
    
    // Dibujo cada celda
    let str = '';
    for (let i = 0; i < array.length; i++) {
        str += `<tr>`
        for (let x = 0; x < array[i].length; x++) {
            const materia = array[i][x] || {name: ''}; // Necesario
            if(materia.terminada){
                str += `<td style="background-color: ${materia.nota > 9.5 ? 'green' : 'red'}">${materia.name}</td>`
            } else {
                str += `<td>${materia.name}</td>`
            }
        }
        str += `</tr>`
    }
    document.getElementById('tablebody').innerHTML = str
}