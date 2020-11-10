const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sheetKey = urlParams.get('sheetkey');

Promise.all([
    readSheetData(sheetKey, 2),
    readSheetData(sheetKey, 1)]).then(start);

var projects, participants;

var tableTrack1, tableTrack2;

function start(data) {

    projects = data[0];
    participants = data[1];

    // Merge projects and participants
    let merged = mergeProjectsAndParticipantsData();
    let registeredProjects = merged.filter((p) => { return p.angemeldet === "JA" && p.participants.length > 0 });
    // Sort projects by time slot
    registeredProjects = registeredProjects.sort(function (a, b) {
        var timeA = a.zeitslot;
        var timeB = b.zeitslot;

        if (timeA < timeB) {
            return -1;
        }
        if (timeA > timeB) {
            return 1;
        }

        return 0;
    });

    let tableTrack1 = document.querySelector("#tableTrack1");
    let tableTrack2 = document.querySelector("#tableTrack2");

    let projectsTrack1 = registeredProjects.filter((p) => { return p.branche === "Lebensmittel" || p.branche === "Obst- und Gartenbau" })
    let projectsTrack2 = registeredProjects.filter((p) => { return p.branche === "Landwirtschaft" })

    for (let i = 0; i < projectsTrack1.length; i++) {

        if (i % 3 === 0 && i > 2) {
            tableTrack1.appendChild(createPlaceholderElement("P A U S E"));
        }

        let projectRowElement = createProjectTableRowItem(projectsTrack1[i]);
        tableTrack1.appendChild(projectRowElement);
    }

    for (let i = 0; i < projectsTrack2.length; i++) {

        if (i % 3 === 0 && i > 2) {
            tableTrack2.appendChild(createPlaceholderElement("P A U S E"));
        }

        let projectRowElement = createProjectTableRowItem(projectsTrack2[i]);
        tableTrack2.appendChild(projectRowElement);
    }
}

function createProjectTableRowItem(project) {

    let tableRowElement = document.createElement('tr');

    // zeit
    columnElement = document.createElement('td');
    columnElement.textContent = project.zeitslot;
    tableRowElement.appendChild(columnElement);

    // titel
    columnElement = document.createElement('td');
    columnElement.textContent = shortenTitle(project.titel);

    columnElement.setAttribute("data-toggle", "tooltip");
    columnElement.setAttribute("data-placement", "top");
    columnElement.setAttribute("title", project.titel);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    tableRowElement.appendChild(columnElement);

    // betreuer/in
    columnElement = document.createElement('td');
    columnElement.textContent = project.nachnamebetreuer;
    tableRowElement.appendChild(columnElement);

    return tableRowElement;
}

function createPlaceholderElement(text) {

    let tableRowElement = document.createElement('tr');
    tableRowElement.classList.add("placeholder")

    // zeit
    columnElement = document.createElement('td');
    columnElement.textContent = "";
    tableRowElement.appendChild(columnElement);

    // titel
    columnElement = document.createElement('td');
    columnElement.textContent = text;
    tableRowElement.appendChild(columnElement);

    // betreuer/in
    columnElement = document.createElement('td');
    columnElement.textContent = "";
    tableRowElement.appendChild(columnElement);

    return tableRowElement;

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

function shortenTitle(title, characters = 55) {
    if (title.length < characters + 5)
        return title;

    let result = title.substring(0, characters - 5) + " [..]";
    return result;
}

function getNumberOfRowsInTable(tableObj) {
    // console.dir(tableObj.children.length);
    return tableObj.children.length;
}