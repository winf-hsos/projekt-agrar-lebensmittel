getData().then(() => {
    fillProjectTable();
})

function fillProjectTable() {
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


