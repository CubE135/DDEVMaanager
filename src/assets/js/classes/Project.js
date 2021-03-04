module.exports = class Project {
    constructor(data) {
        this.name = data.name;
        this.approot = data.approot;
        this.primary_url = data.primary_url;
        this.status = data.status;
        this.type = data.type;
    }

    render() {
        let playPauseButton = 'play';
        let playPauseButtonTitle = 'Start';
        let cliDisabled = 'disabled="true"';
        if (this.status === 'running'){
            playPauseButton = 'stop';
            playPauseButtonTitle = 'Stop';
            cliDisabled = '';
        }
        let html = `
            <div class="project" data-project-name="`+this.name+`">
                <img src="assets/img/folder.png" alt="folder"/>
                <span class="name">`+this.name+`</span>
                <span class="status `+this.status+`"></span>
                <div class="buttons">
                    <i class="fas fa-`+playPauseButton+`" title="`+playPauseButtonTitle+`"></i>
                    <i class="fas fa-terminal" `+cliDisabled+`></i>
                </div>
            </div>
        `;
        $('main').append(html);
    }

    update() {
        let element = $('.project[data-project-name="'+this.name+'"]')
        if (element.length > 0){
            let status = element.find('.status');
            status.removeClass('paused')
            status.removeClass('stopped')
            status.removeClass('running')
            status.addClass(this.status);
        }
    }
}