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
                // console.log(`O processo ${process.name} chegou, e ele ainda tem ${process.turnaroundTime}s para ser executado, ele iniciou a execução em ${tempo}`);
                process.turnaroundTime -= QUANTUM;

                tempo += QUANTUM;
                // console.log(`O processo ${process.name} executou ${QUANTUM}s e agora resta ${process.turnaroundTime} para ser executado, ele está finalizando a execução em ${tempo}`);

                if (process.turnaroundTime <= 0) {
                    // console.log(`O processo ${process.name} chegou a ${process.turnaroundTime}, por isso salvaremos o seu tempo de turnaround`);
                    process.turnaroundTime = tempo;
                    Object.freeze(process);
                    // console.log(`O tempo de turnaround do processo ${process.name} foi salvo como ${process.turnaroundTime}`);
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
            resulValues:turnaroundTimes
        },
        {
            resultName: 'Tempo de espera de cada processo',
            resulValues:processesWaitingTimes
        },
        {
            resultName: 'Tempo médio de retorno',
            resulValues:averageReturnTime
        },
        {
            resultName: 'Tempo médio de espera',
            resulValues:averageWaitingTime
        },
        {
            resultName: 'Tempo total de processador',
            resulValues:totalProcessingTime
        }

    ];
    
    addResults(results);
    
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

