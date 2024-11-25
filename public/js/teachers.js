document.addEventListener('DOMContentLoaded', function() {
    fetchTeachers();
  });
  
  // Fetch teacher data from the external API
  function fetchTeachers() {
    fetch('https://randomuser.me/api/?results=10')
      .then(response => response.json())
      .then(data => {
        const teachers = data.results;
        displayTeachers(teachers);
      })
      .catch(error => {
        console.error('Error fetching teacher data:', error);
      });
  }
  
  // Display teachers in cards
  function displayTeachers(teachers) {
    const teachersGrid = document.getElementById('teachersGrid');
    teachersGrid.innerHTML = '';  // Clear the grid before adding new cards
  
    teachers.forEach(teacher => {
      const teacherCard = document.createElement('div');
      teacherCard.classList.add('teacher-card');
      
      teacherCard.innerHTML = `
        <img src="${teacher.picture.medium}" alt="Teacher Avatar">
        <h3>${teacher.name.first} ${teacher.name.last}</h3>
        <p>${teacher.email}</p>
        <a href="mailto:${teacher.email}">Email Teacher</a>
      `;
      
      teachersGrid.appendChild(teacherCard);
    });
  }
  