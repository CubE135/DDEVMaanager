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
    let button = $(this);
    let project = button.closest('.project');
    let appRoot = project.attr('data-approot');
    ipcRenderer.send('open-folder', appRoot);
});

$(document).on('click', '.project .buttons .startStop', function () {
    let button = $(this);
    let project = button.closest('.project');
    let buttons = project.find('.buttons');
    let projectName = project.attr('data-project-name');
    let status = project.attr('data-status');
    let btnLoading = buttons.find('.loading');
    let btnStartStop = buttons.find('.startStop');
    btnStartStop.hide();
    btnLoading.show();
    if (status === 'running'){
        cmdClient.stopDDEVProject(projectName, (success) => {
            if (!success) return;
            btnStartStop.removeClass('fa-stop');
            btnStartStop.addClass('fa-play');
            btnStartStop.show();
            btnLoading.hide();
        });
    }else{
        cmdClient.startDDEVProject(projectName, (success) => {
            if (!success) return;
            btnStartStop.removeClass('fa-play');
            btnStartStop.addClass('fa-stop');
            btnStartStop.show();
            btnLoading.hide();
        });
    }
});

$(document).on('click', '.project .buttons .startCli', function () {
    let button = $(this);
    let project = button.closest('.project');
    let status = project.attr('data-status');
    let appRoot = project.attr('data-approot');
    if(status === 'running') cmdClient.cliConnect(appRoot)
});

$(document).on('click', '#poweroff', function () {
    let btnLoading = $(this).find('.loading');
    let btnPowerOff = $(this).find('.powerOff');
    btnLoading.show()
    btnPowerOff.hide()
    cmdClient.ddevPowerOff(function () {
        btnLoading.hide()
        btnPowerOff.show()
    });
})

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
    checkDockerStatus();
    cmdClient.getDDEVProjectList(function (projects) {
        projects.forEach(function (projectData) {
            let project = new Project(projectData);
            project.update();
        });
    });
}

function checkDockerStatus() {
    cmdClient.getDockerStatus((status) => {
        let overlay = $('#overlay')
        let body = $('body')
        if(!status){
            overlay.css('display', 'flex');
            body.addClass('overlay-active');
        }else{
            overlay.hide();
            body.removeClass('overlay-active');
        }
    });
}