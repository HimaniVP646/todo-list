const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
let tasks=JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let editingTaskId = null;

function saveTasks() {
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";
    let filteredTasks=tasks.filter(function(task) {
        if(currentFilter == "pending") {
            return !task.completed;
        }
        if (currentFilter == "completed"){
            return task.completed;
        }
        return true;
    });
    if (filteredTasks.length==0){
        const emptyMessage=document.createElement("li");
        emptyMessage.textContent="No tasks to display!";
        taskList.appendChild(emptyMessage);
    }
    
    filteredTasks.forEach(function(task) {

        const taskItem=document.createElement("li");
        taskItem.className="task-item";
        taskItem.dataset.id=task.id;

        const taskText=document.createElement("span");
        taskText.textContent=task.title;

        if(task.completed) {
            taskText.style.textDecoration = "line-through";
            taskText.style.opacity="0.5";
        }

        const completeBtn = document.createElement("button");
        completeBtn.textContent=task.completed?"Undo":"Complete";
        completeBtn.dataset.action="toggle";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.dataset.action = "edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.dataset.action = "delete";

        taskItem.appendChild(taskText);
        taskItem.appendChild(completeBtn);
        taskItem.appendChild(editBtn);
        taskItem.appendChild(deleteBtn);

        taskList.appendChild(taskItem);
    });
    updateStatistics();
}

function addTask(){
    const taskText=taskInput.value.trim();
    if (taskText == ""){
        alert("Please enter a task!");
        return;
    }
    const duplicate=tasks.some(function(task) {
        return task.title.toLowerCase() == taskText.toLowerCase();
    });

    if(duplicate) {
        alert("This task already exists!");
        return;
    }

    const newTask={
        id:Date.now(),
        title: taskText,
        completed:false
    };

    tasks.push(newTask);
    saveTasks();
    displayTasks();

    taskInput.value="";
}

function editTask(taskId) {

    const task = tasks.find(function(task) {
        return task.id === taskId;
    });

    if (!task) {
        return;
    }

    const updatedTitle = prompt("Edit your task:", task.title);

    if (updatedTitle === null) {
        return;
    }

    const newTitle = updatedTitle.trim();

    if (newTitle === "") {
        alert("Task cannot be empty!");
        return;
    }

    const duplicate = tasks.some(function(item) {
        return item.id !== taskId &&
            item.title.toLowerCase() === newTitle.toLowerCase();
    });

    if (duplicate) {
        alert("Another task with this name already exists!");
        return;
    }

    task.title = newTitle;

    saveTasks();
    displayTasks();
}

function deleteTask(taskId) {
    const confirmation = confirm("Are you sure you want to delete this task?");

    if(!confirmation) {
        return;
    }
    tasks=tasks.filter(function(task) {
        return task.id!==taskId;
    });

    saveTasks();
    displayTasks();
} 

function toggleTask(taskId) {
    const task=tasks.find(function(task) {
        return task.id==taskId;
    });
    if(!task) {
        return;
    }
    task.completed=!task.completed;
    saveTasks();
    displayTasks();
}
function updateStatistics() {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pendingTasks = totalTasks - completedTasks;

    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("completedTasks").textContent = completedTasks;
    document.getElementById("pendingTasks").textContent = pendingTasks;
}

function createFilters() {
    const filterContainer=document.createElement("div");
    filterContainer.id="filterContainer";
    const filters=["all","pending","completed"];

    filters.forEach(function(filter) {
        const button=document.createElement("button");
        button.textContent=
        filter.charAt(0).toUpperCase() + filter.slice(1);
        button.dataset.filter=filter;
        filterContainer.appendChild(button);
    });

    taskList.parentElement.insertBefore(filterContainer,taskList);
    filterContainer.addEventListener("click",function(event) {

        const selectedFilter = event.target.dataset.filter;

        if(!selectedFilter) {
            return;
        }

        currentFilter=selectedFilter;
        displayTasks();
    });
}


function createStatistics() {
    const statsContainer = document.createElement("div");
    statsContainer.id = "statsContainer";

    statsContainer.innerHTML = `
        <p>Total Tasks: <span id="totalTasks">0</span></p>
        <p>Completed: <span id="completedTasks">0</span></p>
        <p>Pending: <span id="pendingTasks">0</span></p>
    `;

    taskList.parentElement.insertBefore(statsContainer, taskList);

}

taskList.addEventListener("click",function(event) {
    const action=event.target.dataset.action;
    if(!action) {
        return;
    }
    const taskItem=event.target.closest("li");

    if(!taskItem){
        return;
    }

    const taskId=Number(taskItem.dataset.id);

    if(action=="edit") {
        editTask(taskId);
    }
    else if(action=="delete") {
        deleteTask(taskId);
    }
    if(action=="toggle") {
        toggleTask(taskId);
    }
});

addTaskBtn.addEventListener("click",addTask);

taskInput.addEventListener("keypress",function(event) {

    if (event.key == "Enter") {
        addTask();
    }
});

createStatistics();
createFilters();
displayTasks();
