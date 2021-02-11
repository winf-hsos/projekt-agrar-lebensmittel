sheetKeys = {}
sheetKeys["WS 2020"] = "1Ve7ZlI5FrTtEBEYfixe98JOuwKWKc1dXd_vgM6d2BB8";
sheetKeys["SS 2021"] = "1_HVcvtuA1wf4X_zeah7-dJgdRaNDPy4yJYuV1ek5oYs";


function setupDropDownSemester() {
    let dropdown = document.getElementById("dropdownSemester");

    for (const [key, value] of Object.entries(sheetKeys)) {
        let optionEl = document.createElement("option");
        optionEl.textContent = key;
        optionEl.value = value;

        if (meta && key === meta.semester)
            optionEl.setAttribute("selected", "");

        dropdown.appendChild(optionEl);
    }

    dropdown.addEventListener("change", semesterSelected);
}

function semesterSelected(evt) {
    window.location.href = "?sheetkey=" + evt.target.selectedOptions[0].value;
}

getData().then(() => {
    showAdminFunctions();
    setupDropDownSemester();
})

function showAdminFunctions() {
    document.getElementById("btnMailToAllInstructors").removeAttribute("hidden");
    document.getElementById("btnMailToAllStudents").removeAttribute("hidden");
    document.getElementById("btnMailToAllStudentsInstructorsCc").removeAttribute("hidden");
    document.getElementById("btnsubmitFinalReports").removeAttribute("hidden");


    console.dir(merged);
}

async function getTemplate(name = "empty_mail.html") {
    return fetch('mail_templates/' + name)
        .then(response => {
            if (!response.ok) {
                throw new Error('Fehler beim Lade des Templates >' + name + '<');
            }
            return response.blob();
        })
        .then(myBlob => {
            console.dir(myBlob);
            return myBlob.text()
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

async function mailToAllInstructors() {

    let rawTemplate = await getTemplate()

    let mail = {
        anrede: "Liebe Betreuerinnen und Betreuer im Projekt Agrar/Lebensmittel,",
        content: "<INHALT>"
    };

    let renderedTemplate = ejs.render(rawTemplate, { mail });

    let emailTo = getInstructorsEmailList()
    let emailSubject = " | Projekt Agrar/Lebensmittel | " + meta.semester;
    let htmlDocument = renderedTemplate;

    var emlContent = "data:message/rfc822 eml,";
    emlContent += 'To: ' + emailTo + '\n';
    emlContent += 'Cc: n.meseth@hs-osnabrueck.de\n';
    emlContent += 'Subject: <SUBJECT> ' + emailSubject + '\n';
    emlContent += 'X-Unsent: 1' + '\n';
    emlContent += 'Content-Type: text/html; charset=UTF-8' + '\n';
    emlContent += '' + '\n';
    emlContent += htmlDocument;

    createAndDownloadMail(emlContent, 'Projekt Agrar Lebenmittel - ' + meta.semester + ' - Mail an alle Dozenten.eml');
}

async function mailToAllStudents() {

    let rawTemplate = await getTemplate()

    let mail = {
        anrede: "Liebe Studierende im Projekt Agrar/Lebensmittel,",
        content: "<INHALT>"
    };

    let renderedTemplate = ejs.render(rawTemplate, { mail });
    let emailTo = getStudentsEmailList()
    let emailSubject = " | Projekt Agrar/Lebensmittel | " + meta.semester;

    var emlContent = "data:message/rfc822 eml,";
    emlContent += 'To: ' + emailTo + '\n';
    emlContent += 'Cc: n.meseth@hs-osnabrueck.de\n';
    emlContent += 'Subject: <SUBJECT> ' + emailSubject + '\n';
    emlContent += 'X-Unsent: 1' + '\n';
    emlContent += 'Content-Type: text/html; charset=UTF-8' + '\n';
    emlContent += '' + '\n';
    emlContent += renderedTemplate;

    createAndDownloadMail(emlContent, 'Projekt Agrar Lebenmittel - ' + meta.semester + ' - Mail an alle Studierenden.eml')

}

async function mailToAllStudentsInstructorsCc() {
    let rawTemplate = await getTemplate()
    let mail = {
        anrede: "Liebe Studierende im Projekt Agrar/Lebensmittel,",
        content: "<INHALT>"
    };

    let renderedTemplate = ejs.render(rawTemplate, { mail });
    let emailTo = getStudentsEmailList();
    let emailSubject = " | Projekt Agrar/Lebensmittel | " + meta.semester;

    var emlContent = "data:message/rfc822 eml,";
    emlContent += 'To: ' + emailTo + '\n';
    emlContent += 'Cc: ' + getInstructorsEmailList() + 'n.meseth@hs-osnabrueck.de\n';
    emlContent += 'Subject: <SUBJECT> ' + emailSubject + '\n';
    emlContent += 'X-Unsent: 1' + '\n';
    emlContent += 'Content-Type: text/html; charset=UTF-8' + '\n';
    emlContent += '' + '\n';
    emlContent += renderedTemplate;
    createAndDownloadMail(emlContent, 'Projekt Agrar Lebenmittel - ' + meta.semester + ' - Mail an alle Studierende mit Dozenten in CC.eml');
}

async function mailSubmitFinalReports() {
    console.dir(meta);
    let rawTemplate = await getTemplate("abgabe_abschlussberichte.html")
    let mail = {
        anrede: "Liebe Studierende im Projekt Agrar/Lebensmittel,",
        final_presentations: meta.final_presentations,
        submission_final_reports: meta.submission_final_reports
    };

    let renderedTemplate = ejs.render(rawTemplate, { mail });
    let emailTo = getStudentsEmailList();
    let emailSubject = "Abgabe Projektberichte am " + meta.submission_final_reports + " | Projekt Agrar/Lebensmittel | " + meta.semester;

    var emlContent = "data:message/rfc822 eml,";
    emlContent += 'To: ' + emailTo + '\n';
    emlContent += 'Cc: ' + getInstructorsEmailList() + 'n.meseth@hs-osnabrueck.de\n';
    emlContent += 'Bcc: ' + meta.email_team_room + '\n';
    emlContent += 'Subject: ' + emailSubject + '\n';
    emlContent += 'X-Unsent: 1' + '\n';
    emlContent += 'Content-Type: text/html; charset=UTF-8' + '\n';
    emlContent += '' + '\n';
    emlContent += renderedTemplate;
    createAndDownloadMail(emlContent, 'Projekt Agrar Lebenmittel - ' + meta.semester + ' - Abgabe der Projektberichte.eml');
}


function createAndDownloadMail(content, fileName) {
    var encodedUri = encodeURI(content);
    var a = document.createElement('a');
    var linkText = document.createTextNode("fileLink");
    a.appendChild(linkText);
    a.href = encodedUri;
    a.id = 'fileLink';
    a.download = fileName;
    a.style = "display:none;";
    document.body.appendChild(a);
    document.getElementById('fileLink').click();
}

function getInstructorsEmailList() {
    let emailString = "";
    let emails = new Set();

    for (let i = 0; i < merged.length; i++) {
        emails.add(merged[i].emailbetreuer);
    }

    emails.forEach((e) => {
        emailString += e + ";";
    })

    return emailString;
}


function getStudentsEmailList() {

    let emailString = "";
    let emails = new Set();

    for (let i = 0; i < merged.length; i++) {
        for (let j = 0; j < merged[i].participants.length; j++) {
            emails.add(merged[i].participants[j].email);
        }

    }
    emails.forEach((e) => {
        emailString += e + ";";
    })

    return emailString;
}