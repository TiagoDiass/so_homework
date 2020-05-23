const insertButton = document.querySelector('#addProcess');
const removeButton = document.querySelector('#removeProcess');
const cleanButton = document.querySelector('#clear')
const tableArea = document.querySelector('#table-area');

insertButton.addEventListener('click', function (e) {
    e.preventDefault();
    addProcess();
});

function addToTable (proccess) {
    const keys = Object.keys(proccess);
    let tr = document.createElement('tr');

    for (key of keys) {
        let td = document.createElement('td');
        td.innerHTML = proccess[key];
        tr.appendChild(td);
    }

    tableArea.appendChild(tr);
}

let proccesses = [];

function addProcess () {
    let name = prompt('Digite o nome do processo:');
    let createTime = parseInt(prompt('Digite o tempo de criação do processo:'));
    let executionTime = parseInt(prompt('Digite o tempo de execução do processo:'));
    let priority = parseInt(prompt('Digite a prioridade desse processo:'));

    let proccess = {
        name,
        createTime,
        executionTime,
        priority
    }

    proccesses.push(proccess);
    addToTable(proccess);
    return proccess;
}

