let academicMaps = JSON.parse(localStorage.getItem('academicMaps')) || { programs: [] };
let programs = academicMaps.programs.map(p => p.name);
const courseList = JSON.parse(localStorage.getItem('courseList')) ?? [];
const electivesList = JSON.parse(localStorage.getItem('electivesList')) ?? {};

function displayProgramNavigation() {
    const programTabs = document.getElementById('programTabs');
    const programTabsContent = document.getElementById('programTabsContent');
    programTabs.innerHTML = '';
    programTabsContent.innerHTML = '';
    programs.forEach((program, index) => {
        // Create tab
        const tab = document.createElement('li');
        tab.className = 'nav-item d-flex justify-content-around m-1';
        tab.innerHTML = `
            <a class="nav-link ${index === 0 ? 'active' : ''}" id="tab-${index}" data-toggle="tab" href="#content-${index}" role="tab" aria-controls="content-${index}" aria-selected="${index === 0 ? 'true' : 'false'}">${program}</a>
            <button class="btn btn-danger btn-sm ml-2 admin-only" onclick="deleteProgram('${program}')">Delete program</button>
        `;
        tab.querySelector('a').addEventListener('click', () => {
            setTimeout(function () {
                window.displayAcademicMap();
            }, 1000);
        });

        programTabs.appendChild(tab);

        // Create tab content
        const tabContent = document.createElement('div');
        tabContent.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
        tabContent.id = `content-${index}`;
        tabContent.setAttribute('role', 'tabpanel');
        tabContent.setAttribute('aria-labelledby', `tab-${index}`);
        programTabsContent.appendChild(tabContent);
    });
    window.displayAcademicMap();
}

function fetchPrograms() {
    const anyProgramsSaved = programs.length > 0;
    if (anyProgramsSaved) {
        document.getElementById('programs-container').style.display = 'flex';
        document.getElementById('no-programs-found').style.display = 'none';
        displayProgramNavigation();
    } else {
        document.getElementById('programs-container').style.display = 'none';
        document.getElementById('no-programs-found').style.display = 'flex';
    }
}

function createProgram() {
    const programName = document.getElementById('programInput').value.trim();
    if (programName && !programs.includes(programName)) {
        programs.push(programName);
        const newProgram = {
            name: programName,
            years: [
                { year: 1, semesterFall: { courses: [] }, semesterSpring: { courses: [] } },
                { year: 2, semesterFall: { courses: [] }, semesterSpring: { courses: [] } },
                { year: 3, semesterFall: { courses: [] }, semesterSpring: { courses: [] } },
                { year: 4, semesterFall: { courses: [] }, semesterSpring: { courses: [] } }
            ]
        };
        academicMaps.programs.push(newProgram);
        localStorage.setItem('programs', JSON.stringify(programs));
        localStorage.setItem('academicMaps', JSON.stringify(academicMaps));
        fetchPrograms();
    } else {
        alert("Program name is either empty or already exists.");
    }
}

function deleteProgram(programName) {
    const programIndex = academicMaps.programs.findIndex(p => p.name === programName);
    if (programIndex !== -1) {
        academicMaps.programs.splice(programIndex, 1);
        programs = academicMaps.programs.map(p => p.name);
        localStorage.setItem('programs', JSON.stringify(programs));
        localStorage.setItem('academicMaps', JSON.stringify(academicMaps));
        fetchPrograms();
    }
}

function populateCourseDropdown() {
    const yearSelect = document.getElementById('year-select');
    const semesterSelect = document.getElementById('semester-select');
    const courseSelect = document.getElementById('course-select');

    const year = yearSelect.value;
    const semester = semesterSelect.value;

    if (year === "" || semester === "") {
        return;
    }

    // Fetch the available courses
    const allCourses = [...courseList, ...Object.values(electivesList).flat()];

    courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
    allCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.courseCode;
        option.textContent = `${course.courseCode} - ${course.courseName}`;
        courseSelect.appendChild(option);
    });
}

document.getElementById('year-select').addEventListener('change', populateCourseDropdown);
document.getElementById('semester-select').addEventListener('change', populateCourseDropdown);
document.addEventListener('DOMContentLoaded', fetchPrograms);
