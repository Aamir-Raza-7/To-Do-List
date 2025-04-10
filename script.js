document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const btn = document.getElementById("button");
    const tasklist = document.getElementById("taskList");

    // Create task function
    // This function creates a new task and adds it to the task list
    const createTask = (taskText, completed = false) => {
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" class="checkbox"/>
        <span>${taskText}</span>
        <div class="taskButtons">
        <button class="editButton"><i class="fa-solid fa-pen"></i></button>
        <button class="deleteButton"><i class="fa-solid fa-trash"></i></button>
        </div>`;

        const span = li.querySelector("span");
        const checkbox = li.querySelector(".checkbox");
        const deleteButton = li.querySelector(".deleteButton");
        const editButton = li.querySelector(".editButton");

        li.classList.add("li-hover");

        // Set checkbox state and text decoration based on completion status
        checkbox.checked = completed;
        span.style.textDecoration = completed ? "line-through" : "none";
        if(checkbox.checked){
            span.style.color = "black"
        } 
        editButton.disabled = completed;
        editButton.style.cursor = completed ? "not-allowed" : "pointer";
        if (completed) li.classList.remove("li-hover");

        // checkbox event listener
        checkbox.addEventListener("change", () => {
            const isChecked = checkbox.checked;
            li.classList.toggle("li-hover", !isChecked);
            span.style.textDecoration = isChecked ? "line-through" : "none";
            editButton.disabled = isChecked;
            editButton.style.cursor = isChecked ? "not-allowed" : "pointer";
            taskCompleted();
            saveTasks();
        });

        // delete button event listener
        deleteButton.addEventListener("click", () => {
            li.remove();
            taskCompleted();
            saveTasks();
        });

        // edit button event listener
        editButton.addEventListener("click", () => {
            span.contentEditable = true;
            span.focus();
            span.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    span.contentEditable = false;
                    saveTasks();
                }
            });
        });
        tasklist.appendChild(li);
    };

    // Add task to list
    const addTask = (e) => {
        e.preventDefault();
        const taskText = input.value.trim();
        if (!taskText) return;
        createTask(taskText);
        input.value = "";
        taskCompleted();
        saveTasks();
    };

    // Save tasks to local storage
    const saveTasks = () => {
        const tasks = Array.from(tasklist.querySelectorAll("li")).map(li => ({
            text: li.querySelector("span").textContent,
            completed: li.querySelector(".checkbox").checked
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    // Load tasks from local storage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(({ text, completed }) => createTask(text, completed));
        taskCompleted();
    };

    // Check if all tasks are completed
    const taskCompleted = () => {
        const totalTasks = tasklist.children.length;
        const completedTasks = tasklist.querySelectorAll(".checkbox:checked").length;
        document.getElementById("status").textContent = `${completedTasks} / ${totalTasks}`;
        if (totalTasks > 0 && totalTasks === completedTasks) {
            console.log("All tasks completed!");
            animate();
        }
    };

    // Event Listeners for input and button
    btn.addEventListener("click", addTask);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask(e);
    });

    loadTasks();
});

// Confetti function
const animate = () => {
    const duration = 3 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        }));
    }, 250);
};
