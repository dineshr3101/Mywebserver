let editMode = false;
let editRow = null;
let currentId = null;  // Track the current student ID being edited or added

// Open Modal
function openModal() {
    document.getElementById('addStudentModal').style.display = 'block';
}

// Close Modal
function closeModal() {
    document.getElementById('addStudentModal').style.display = 'none';
    document.getElementById('addStudentForm').reset();
    editMode = false;
    editRow = null;  // Reset editRow
}

// Fetch all students from the database and populate the table
function fetchStudents() {
    fetch('/api/students')
        .then(response => response.json())
        .then(students => {
            const studentTableBody = document.getElementById('studentTableBody');
            studentTableBody.innerHTML = '';  // Clear table before appending new data
            students.forEach(student => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.address}</td>
                    <td>${student.city}</td>
                    <td>${student.state}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editStudent(this)">Edit</button>
                        <button class="btn btn-delete" onclick="deleteStudent(${student.id}, this)">Delete</button>
                    </td>
                `;
                studentTableBody.appendChild(newRow);
            });
        })
        .catch(error => console.error('Error fetching students:', error));
}

// Add or Edit Student in Table
document.getElementById('addStudentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get values from the form
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (editMode && editRow) {
        // Update existing student (PUT request)
        fetch(`/api/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, address, city, state, email, phone })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the row in the table
                    editRow.cells[1].textContent = name;
                    editRow.cells[2].textContent = address;
                    editRow.cells[3].textContent = city;
                    editRow.cells[4].textContent = state;
                    editRow.cells[5].textContent = email;
                    editRow.cells[6].textContent = phone;
                    closeModal();
                } else {
                    alert('Failed to update the student.');
                }
            })
            .catch(error => {
                console.error('Error updating student:', error);
                alert('Error updating student.');
            });
    } else {
        // Add new student (POST request)
        fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, address, city, state, email, phone })
        })
            .then(response => response.json())
            .then(data => {
                // Add new row for student in the table
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${data.id}</td>
                    <td>${data.name}</td>
                    <td>${data.address}</td>
                    <td>${data.city}</td>
                    <td>${data.state}</td>
                    <td>${data.email}</td>
                    <td>${data.phone}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editStudent(this)">Edit</button>
                        <button class="btn btn-delete" onclick="deleteStudent(${data.id}, this)">Delete</button>
                    </td>
                `;
                document.getElementById('studentTableBody').appendChild(newRow);
                closeModal();  // Close the modal after success
            })
            .catch(error => {
                console.error('Error adding student:', error);
                alert('Error adding student.');
            });
    }
});

// Edit Student
function editStudent(button) {
    // Get the selected row
    editRow = button.parentElement.parentElement;

    // Get the current values from the row
    const id = editRow.cells[0].textContent;
    const name = editRow.cells[1].textContent;
    const address = editRow.cells[2].textContent;
    const city = editRow.cells[3].textContent;
    const state = editRow.cells[4].textContent;
    const email = editRow.cells[5].textContent;
    const phone = editRow.cells[6].textContent;

    // Set the form values to the current row data
    document.getElementById('id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('address').value = address;
    document.getElementById('city').value = city;
    document.getElementById('state').value = state;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;

    // Set edit mode to true
    editMode = true;

    // Open the modal with populated data
    openModal();
}

// Delete Student
function deleteStudent(id, button) {
    if (confirm('Are you sure you want to delete this student?')) {
        fetch(`/api/students/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove the selected row from the table
                    button.parentElement.parentElement.remove();
                } else {
                    alert('Failed to delete the student.');
                }
            })
            .catch(error => {
                console.error('Error deleting student:', error);
                alert('Error deleting student.');
            });
    }
}

// Fetch students on page load
window.onload = fetchStudents;
