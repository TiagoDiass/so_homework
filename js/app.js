const insertButton = document.querySelector('#addProcess');
const removeButton = document.querySelector('#removeProcess');
const clearButton = document.querySelector('#clear')
const calculateButton = document.querySelector('#calculate');
const tableArea = document.querySelector('#table-area');

let processes = [];

class Process {
    constructor(name, createTime, executionTime){
        this.name = name,
        this.createTime = createTime,
        this.executionTime = executionTime,
        this.turnaroundTime = this.executionTime
    }

    show () {
        console.log(`Processo ${this.name}\nTempo de criação: ${this.createTime}\nTempo de execução: ${this.executionTime}\nTempo de turnaround: ${this.turnaroundTime}`);
    }
}

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

calculateButton.addEventListener('click', function (event) {
    event.preventDefault();
    calculateResults();
});

function addProcess () {
    let name = prompt('Digite o nome do processo:');
    let createTime = 0;
    let executionTime = parseInt(prompt('Digite o tempo de execução do processo:'));

    if (!executionTime) return alert('Valor inválido, digite um número!');

    let process = new Process(name, createTime, executionTime);

    processes.push(process);
    addToTable(process);
}

function addToTable (process) {
    let tableRow = document.createElement('tr');
    tableRow.setAttribute('id', process.name);

    const attributes = Object.keys(process);
    
    for (attribute of attributes) {
        if (attribute != 'turnaroundTime') {
            let tableData = document.createElement('td');
            tableData.innerHTML = process[attribute];
            tableRow.appendChild(tableData);
        }
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
    
    let container = document.querySelector('.container')
    let resultsArea = container.querySelector('#results');
    resultsArea.querySelector('thead').innerHTML = '';
    resultsArea.querySelector('tbody').innerHTML = '';
    processes = [];
}

function calculateResults () {
    
    const QUANTUM = parseInt(prompt('Digite o QUANTUM?'));

    let totalProcessingTime = 0;
    
    for (process of processes) {
        totalProcessingTime += process.executionTime;
    }

    let tempo = 0;
    while (tempo < totalProcessingTime){
        
        processes.forEach(process => {
            if (process.turnaroundTime > 0 && !Object.isFrozen(process)) {
                process.turnaroundTime -= QUANTUM;
                
                tempo += QUANTUM;

                if (process.turnaroundTime < 0) {
                    tempo -= process.turnaroundTime * (-1);
                }

                if (process.turnaroundTime <= 0) {
                    process.turnaroundTime = tempo;
                    Object.freeze(process);
                }
            }
        });    
    }

    const turnaroundTimes = processes.map(process => process.turnaroundTime);
    const processesWaitingTimes = processes.map(process => (process.turnaroundTime - process.createTime - process.executionTime));
    
    let averageReturnTime = 0; 
    turnaroundTimes.forEach(turnaroundTime => {
        averageReturnTime += turnaroundTime;
    });
    averageReturnTime = averageReturnTime / processes.length;

    let averageWaitingTime = 0;
    processesWaitingTimes.forEach(processWaitingTime => averageWaitingTime += processWaitingTime);
    averageWaitingTime = averageWaitingTime / processes.length;

    console.log(totalProcessingTime);

    let results = [
        {
            resultName: 'Tempo de turnaround de cada processo',
            resultsValues: turnaroundTimes
        },
        {
            resultName: 'Tempo de espera de cada processo',
            resultsValues: processesWaitingTimes
        },
        {
            resultName: 'Tempo médio de retorno',
            resultsValues: [averageReturnTime]
        },
        {
            resultName: 'Tempo médio de espera',
            resultsValues: [averageWaitingTime]
        },
        {
            resultName: 'Tempo total de processador',
            resultsValues: [totalProcessingTime]
        }

    ];
    
    addResults(results);
    
}

function addResults (results) {
    
    let resultsTable = document.querySelector('#results');
    let tableHead = resultsTable.querySelector('thead');

    let tableHeadRow = document.createElement('tr');
    let firstColumn = document.createElement('th');
    firstColumn.innerHTML = 'RESULTADOS';
    tableHeadRow.appendChild(firstColumn);
    for (process of processes) {
        let tableHeadData = document.createElement('th');
        tableHeadData.innerHTML = process.name;
        tableHeadRow.appendChild(tableHeadData);
    }

    tableHead.appendChild(tableHeadRow);

    let tableBody = resultsTable.querySelector('tbody');

    results.forEach(resultObject => {
        let tableRow = document.createElement('tr');
        
        let processNameInTable = document.createElement('td');
        processNameInTable.innerHTML = resultObject.resultName;
        tableRow.appendChild(processNameInTable);

        resultObject.resultsValues.forEach((attribute, attributeIndex, array) => {
            let colspanLength = array.length !== 1 ? 1 : processes.length; 
            let tableData = document.createElement('td');
            tableData.innerHTML = attribute;
            tableData.setAttribute('colspan', colspanLength);
            tableRow.appendChild(tableData);
        });

        tableBody.appendChild(tableRow);

        resultsTable.appendChild(tableHead);
        resultsTable.appendChild(tableBody);
    });
}

function seed () {
    
    const createTime = 0;

    let shits = [];
    shits[0] = new Process('A', createTime, 6);

    shits[1] = new Process('B', createTime, 8);

    shits[2] = new Process('C', createTime, 4);

    shits[3] = new Process('D', createTime, 2);
    
    shits.forEach(shit => {
        processes.push(shit);
        addToTable(shit);
    });
}

