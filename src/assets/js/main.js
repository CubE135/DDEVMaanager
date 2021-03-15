const { ipcRenderer } = require('electron');
const $ = require('jquery');
const CmdClient = require('./assets/js/classes/CmdClient.js')
const Project = require('./assets/js/classes/Project.js')

let cmdClient = new CmdClient();

fillProjectList();
setInterval(() => {
    updateProjectList();
}, 1000)

$(document).on('click', '.project .folder', function () {
    let approot = $(this).attr('data-approot');
    ipcRenderer.send('open-folder', approot);
});

$(document).on('click', '.project .buttons .startStop', function () {
    let button = $(this);
    let project = button.closest('.project');
    let projectName = project.attr('data-project-name');
    let status = project.attr('data-status');
    button.removeClass('fa-play').removeClass('fa-stop');
    button.addClass('fa-spinner fa-pulse');
    if (status === 'running'){
        cmdClient.stopDDEVProject(projectName, () => {
            button.removeClass('fa-spinner fa-pulse');
            button.addClass('fa-play');
        });
    }else{
        cmdClient.startDDEVProject(projectName, () => {
            button.removeClass('fa-spinner fa-pulse');
            button.addClass('fa-stop');
        });
    }
});

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