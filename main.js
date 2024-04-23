window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const tasksContainer = document.querySelector("#tasks");

    // Function to create a task element
    function createTaskElement(task) {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");

        const contentElement = document.createElement("div");
        contentElement.classList.add("content");

        const textElement = document.createElement("input");
        textElement.classList.add("text");
        textElement.type = "text";
        textElement.value = task.content;
        textElement.setAttribute("readonly", "readonly");

        contentElement.appendChild(textElement);

        const actionsElement = document.createElement("div");
        actionsElement.classList.add("actions");

        const editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.innerText = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerText = "Delete";

        actionsElement.appendChild(editButton);
        actionsElement.appendChild(deleteButton);

        taskElement.appendChild(contentElement);
        taskElement.appendChild(actionsElement);

        tasksContainer.appendChild(taskElement);

        // Add event listeners for edit and delete buttons
        editButton.addEventListener('click', () => {
            if (editButton.innerText.toLowerCase() === "edit") {
                textElement.removeAttribute("readonly");
                textElement.focus();
                editButton.innerText = "Save";
            } else {
                // Send update request to backend
                const taskId = task._id;
                const updatedContent = textElement.value;
                axios.put(`http://localhost:3000/api/tasks/${taskId}`, { content: updatedContent })
                .then(response => {
                    textElement.setAttribute("readonly", "readonly");
                    editButton.innerText = "Edit";
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to update task. Please try again.');
                });
            }
        });

        deleteButton.addEventListener('click', () => {
            // Send delete request to backend
            const taskId = task._id;
            axios.delete(`http://localhost:3000/api/tasks/${taskId}`)
            .then(response => {
                // Remove the task element from the DOM
                taskElement.remove();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to delete task. Please try again.');
            });
        });
    }

    // Add event listener for form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskContent = input.value.trim();
        
        if (!taskContent) {
            alert("Please enter a task");
            return;
        }

        // Send post request to backend to add new task
        axios.post('http://localhost:3000/api/tasks', { content: taskContent })
        .then(response => {
            createTaskElement(response.data);
            input.value = "";
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add task. Please try again.');
        });
    });

    // Fetch tasks from backend when the page loads
    axios.get('http://localhost:3000/api/tasks')
    .then(response => {
        response.data.forEach(task => {
            createTaskElement(task);
            // console.log(task);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch tasks. Please try again.');
    });
});
