const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sheetKey = urlParams.get('sheetkey');

var projects, participants, meta, registeredProjects, merged;

async function getData() {
    if (sheetKey) {
        return Promise.all([
            readSheetData(sheetKey, 3),
            readSheetData(sheetKey, 2),
            readSheetData(sheetKey, 1)]).then(_prepareData);
    } else return;
}

function _prepareData(data) {

    projects = data[0];
    participants = data[1];
    meta = data[2];

    metaDict = {}
    for (let i = 0; i < meta.rows.length; i++) {
        metaDict[meta.rows[i]["key"]] = meta.rows[i]["value"]
    }
    meta = metaDict;

    // Set the title of the website
    setTitle(meta.semester);

    // Merge projects and participants
    merged = mergeProjectsAndParticipantsData();
    registeredProjects = merged.filter((p) => { return (p.status === "Angemeldet" && p.participants.length > 0) || p.status === "Offen" });
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

function setTitle(semester) {
    document.getElementById("semester").textContent = "| " + semester;
    document.getElementById("semester").removeAttribute("hidden");

}