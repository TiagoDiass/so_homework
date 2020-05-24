const insertButton = document.querySelector('#addProcess');
const removeButton = document.querySelector('#removeProcess');
const clearButton = document.querySelector('#clear')
const calculateButton = document.querySelector('#calculate');
const tableArea = document.querySelector('#table-area');

let processes = [];

insertButton.addEventListener('click', function (event) {
    event.preventDefault();
    addProcess();
});

removeButton.addEventListener('click', function (event) {
    event.preventDefault();
    let processToBeRemovedName = prompt('Digite o nome do processo que você deseja remover:');
    removeProcess(processToBeRemovedName);
});

clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    clearTable();
});

// calculateButton.addEventListener('click', function (event) {
//     event.preventDefault();
//     calculateResults();
// });

function addProcess () {
    let name = prompt('Digite o nome do processo:');
    let createTime = 0;
    let executionTime = parseInt(prompt('Digite o tempo de execução do processo:'));

    if (!executionTime) return alert('Valor inválido, digite um número!');

    let process = {
        name,
        createTime,
        executionTime
    }

    processes.push(process);
    addToTable(process);
}

function addToTable (process) {
    let tableRow = document.createElement('tr');
    tableRow.setAttribute('id', process.name);

    const attributes = Object.keys(process);
    
    for (attribute of attributes) {
        let tableData = document.createElement('td');
        tableData.innerHTML = process[attribute];
        tableRow.appendChild(tableData);
    }

    tableArea.querySelector('tbody').appendChild(tableRow);
}

function removeProcess (processToBeRemovedName) {
    const tableBody = tableArea.querySelector('tbody');
    const elementToBeRemoved = tableBody.querySelector(`#${processToBeRemovedName}`);
    
    if (!elementToBeRemoved) return alert('Não encontramos nenhum processo com este nome!');

    processes.forEach((process, processIndex) => {
        if (process.name === processToBeRemovedName) {
            processes.splice(processIndex, 1);
        }
    });

    tableBody.removeChild(elementToBeRemoved);
}

function clearTable () {
    const tableBody = tableArea.querySelector('tbody');
    tableBody.innerHTML = '';
    processes = [];
}

function calculateResults () {
    
    const QUANTUM = parseInt(prompt('Digite o QUANTUM?'));

    let totalProcessingTime = 0;
    
    for (process of processes) {
        totalProcessingTime += process.executionTime;
    }

    let exit = false;
    while (exit != true) {
        processes.forEach(process => {
            if (process.executionTime > 0) {
               process.executionTime = process.executionTime -= QUANTUM < 0 ? 0 : process.executionTime -= QUANTUM;
               totalProcessingTime -= totalProcessingTime - QUANTUM;
               
               if (process.executionTime === 0) {
                   process.turnAroundTime = totalProcessingTime;
               }
            }

            if (totalProcessingTime == 0) exit = true;

        });
    }    
}

