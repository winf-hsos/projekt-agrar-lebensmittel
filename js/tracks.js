const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sheetKey = urlParams.get('sheetkey');

Promise.all([
    readSheetData(sheetKey, 3),
    readSheetData(sheetKey, 2)]).then(start);

var projects, participants;
var tableTrack1, tableTrack2, tableTrack3;
var tracks;

function start(data) {

    projects = data[0];
    participants = data[1];

    // Merge projects and participants
    let merged = mergeProjectsAndParticipantsData();
    let registeredProjects = merged.filter((p) => { return p.status === "Angemeldet" && p.participants.length > 0 });

    console.dir(registeredProjects);

    tracks = new Set();
    for (let i = 0; i < registeredProjects.length; i++) {
        tracks.add(registeredProjects[i].track);
    }
    tracks = Array.from(tracks);

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

    let track1 = document.querySelector("#track1");
    let track2 = document.querySelector("#track2");
    let track3 = document.querySelector("#track3");

    let titleTrack1 = document.querySelector("#titleTrack1");
    let titleTrack2 = document.querySelector("#titleTrack2");
    let titleTrack3 = document.querySelector("#titleTrack3");

    tableTrack1 = document.querySelector("#tableTrack1");
    tableTrack2 = document.querySelector("#tableTrack2");
    tableTrack3 = document.querySelector("#tableTrack3");

    let projectsTrack1 = [];
    let projectsTrack2 = [];
    let projectsTrack3 = [];

    if (tracks.length === 1) {
        projectsTrack1 = registeredProjects.filter((p) => { return p.track === tracks[0] });

        titleTrack1.textContent = tracks[0];

        track1.removeAttribute("hidden");
    }
    if (tracks.length === 2) {
        projectsTrack1 = registeredProjects.filter((p) => { return p.track === tracks[0] });
        projectsTrack2 = registeredProjects.filter((p) => { return p.track === tracks[1] });

        titleTrack1.textContent = tracks[0];
        titleTrack2.textContent = tracks[1];

        track1.removeAttribute("hidden");
        track2.removeAttribute("hidden");
    }

    if (tracks.length === 3) {
        projectsTrack1 = registeredProjects.filter((p) => { return p.track === tracks[0] });
        projectsTrack2 = registeredProjects.filter((p) => { return p.track === tracks[1] });
        projectsTrack3 = registeredProjects.filter((p) => { return p.track === tracks[2] });

        titleTrack1.textContent = tracks[0];
        titleTrack2.textContent = tracks[1];
        titleTrack3.textContent = tracks[2];

        track1.removeAttribute("hidden");
        track2.removeAttribute("hidden");
        track3.removeAttribute("hidden");
    }

    for (let i = 0; i < projectsTrack1.length; i++) {

        // PAUSE every 3rd presentation
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

    for (let i = 0; i < projectsTrack3.length; i++) {

        if (i % 3 === 0 && i > 2) {
            tableTrack3.appendChild(createPlaceholderElement("P A U S E"));
        }

        let projectRowElement = createProjectTableRowItem(projectsTrack3[i]);
        tableTrack3.appendChild(projectRowElement);
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
    if (tracks.length === 1)
        characters = 150;
    if (title.length < characters + 5)
        return title;

    let result = title.substring(0, characters - 5) + " [..]";
    return result;
}

function getNumberOfRowsInTable(tableObj) {
    // console.dir(tableObj.children.length);
    return tableObj.children.length;
}