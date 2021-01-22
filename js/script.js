const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sheetKey = urlParams.get('sheetkey');

Promise.all([
    readSheetData(sheetKey, 3),
    readSheetData(sheetKey, 2),
    readSheetData(sheetKey, 1)]).then(start);

var projects, participants;

function start(data) {

    projects = data[0];
    participants = data[1];
    meta = data[2];

    // Set the title of the website
    setTitle(meta);

    // Merge projects and participants
    let merged = mergeProjectsAndParticipantsData();
    let registeredProjects = merged.filter((p) => { return (p.angemeldet === "Angemeldet" && p.participants.length > 0) || p.status === "Offen" });

    let projectTable = document.querySelector("#projectTableRows");

    for (let i = 0; i < registeredProjects.length; i++) {
        let projectRowElement = createProjectTableRowItem(i + 1, registeredProjects[i]);
        projectTable.appendChild(projectRowElement);
    }
}


function createProjectTableRowItem(nr, project) {

    let tableRowElement = document.createElement('tr');

    let columnElement = document.createElement('td');
    columnElement.textContent = nr;
    tableRowElement.appendChild(columnElement);

    // track
    columnElement = document.createElement('td');
    columnElement.textContent = project.branche;
    tableRowElement.appendChild(columnElement);

    if (project.branche === "Landwirtschaft") {
        tableRowElement.classList.add("landwirtschaft")
    }

    if (project.branche === "Lebensmittel") {
        tableRowElement.classList.add("lebensmittel")
    }

    if (project.branche === "Obst- und Gartenbau") {
        tableRowElement.classList.add("gartenbau")
    }


    // titel
    columnElement = document.createElement('td');
    columnElement.textContent = project.titel;
    tableRowElement.appendChild(columnElement);


    // betreuer/in
    columnElement = document.createElement('td');
    columnElement.textContent = project.nachnamebetreuer;
    tableRowElement.appendChild(columnElement);

    // participants
    columnElement = document.createElement('td');
    console.dir()
    let participants = getParticipantsString(project.projektid);
    console.dir(participants);
    columnElement.innerHTML = getParticipantsString(project.projektid);
    tableRowElement.appendChild(columnElement);

    // status
    columnElement = document.createElement('td');
    columnElement.textContent = project.status;
    tableRowElement.appendChild(columnElement);



    return tableRowElement;

}


function getParticipantsString(projectId) {

    let result = "";
    for (let i = 0; i < participants.rows.length; i++) {

        if (participants.rows[i].projektid === projectId) {
            result += participants.rows[i].email + "<br>";
        }
    }

    return result;

}


function mergeProjectsAndParticipantsData() {

    var result = [];
    for (let i = 0; i < projects.rows.length; i++) {

        let project = projects.rows[i];
        project.participants = [];

        for (let j = 0; j < participants.rows.length; j++) {
            if (participants.rows[j].projektid === project.projektid) {
                project.participants.push(participants.rows[j]);
            }
        }

        result.push(project);
    }

    return result;

}

function setTitle(meta) {
    for (let i = 0; i < meta.rows.length; i++) {
        if (meta.rows[i]["key"] == "semester") {
            document.getElementById("semester").textContent = "| " + meta.rows[i]["value"];
            document.getElementById("semester").removeAttribute("hidden");
        }
    }
}