const $ = require('jquery');
const CmdClient = require('./assets/js/classes/CmdClient.js')
const Project = require('./assets/js/classes/Project.js')

let cmdClient = new CmdClient();

fillProjectList();
setInterval(() => {
    // updateProjectList();
}, 1000)

function fillProjectList() {
    $('main').empty();
    cmdClient.getDDEVProjectList(function (projects) {
        projects.forEach(function (projectData) {
            let project = new Project(projectData);
            project.render();
        });
    });
}

function updateProjectList() {
    cmdClient.getDDEVProjectList(function (projects) {
        projects.forEach(function (projectData) {
            let project = new Project(projectData);
            project.update();
        });
    });
}