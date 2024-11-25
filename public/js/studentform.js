let editMode = false;
let editRow = null;
let currentId = 1;  // Start ID from 1

// Open Modal
function openModal() {
    document.getElementById('addStudentModal').style.display = 'block';
    document.getElementById('id').value = currentId;  // Set ID in the modal
}

// Close Modal
function closeModal() {
    document.getElementById('addStudentModal').style.display = 'none';
    document.getElementById('addStudentForm').reset();
    editMode = false;
    editRow = null;  // Reset editRow
}

// Add or Edit Student in Table
document.getElementById('addStudentForm').addEventListener('submit', function(event) {
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
        // Update the existing row
        editRow.cells[0].textContent = id;
        editRow.cells[1].textContent = name;
        editRow.cells[2].textContent = address;
        editRow.cells[3].textContent = city;
        editRow.cells[4].textContent = state;
        editRow.cells[5].textContent = email;
        editRow.cells[6].textContent = phone;
    } else {
        // Create new row for student
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${id}</td>
            <td>${name}</td>
            <td>${address}</td>
            <td>${city}</td>
            <td>${state}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>
                <button class="btn btn-edit" onclick="editStudent(this)">Edit</button>
                <button class="btn btn-delete" onclick="deleteStudent(this)">Delete</button>
            </td>
        `;

        // Append the new student row to the table
        document.getElementById('studentTableBody').appendChild(newRow);
        currentId++;  // Increment ID for next student
    }

    // Close modal and reset form
    closeModal();
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
    document.getElementById('id').value = id;  // ID is now editable in form
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
function deleteStudent(button) {
    button.parentElement.parentElement.remove();
}
