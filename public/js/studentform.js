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
    const studentData = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    // Send data to the server
    fetch('/add-student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    })
    .then(response => response.json())
    .then(data => {
        // Add the new student to the table
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${data.id}</td>
            <td>${studentData.name}</td>
            <td>${studentData.address}</td>
            <td>${studentData.city}</td>
            <td>${studentData.state}</td>
            <td>${studentData.email}</td>
            <td>${studentData.phone}</td>
            <td>
                <button class="btn btn-edit" onclick="editStudent(this)">Edit</button>
                <button class="btn btn-delete" onclick="deleteStudent(this)">Delete</button>
            </td>
        `;
        document.getElementById('studentTableBody').appendChild(newRow);
        currentId++;

        closeModal();  // Close modal after submission
    })
    .catch(err => console.error('Error adding student:', err));
});

// Fetch and display students on page load
window.onload = function() {
  fetch('/students')
    .then(response => response.json())
    .then(data => {
      const studentTableBody = document.getElementById('studentTableBody');
      studentTableBody.innerHTML = '';  // Clear the table

      data.forEach(student => {
        const row = `
          <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.address}</td>
            <td>${student.city}</td>
            <td>${student.state}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>
              <button class="btn btn-edit" onclick="editStudent(this)">Edit</button>
              <button class="btn btn-delete" onclick="deleteStudent(this)">Delete</button>
            </td>
          </tr>
        `;
        studentTableBody.innerHTML += row;
      });
    })
    .catch(err => console.error('Error fetching student data:', err));
};
