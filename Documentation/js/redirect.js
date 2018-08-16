class Redirect{
    constructor() {
        this.name = localStorage.getItem('title');
        localStorage.removeItem('title');
        window.onbeforeunload = function delete_storage() {
            localStorage.removeItem('title');
            return ''
        }
    }

}

module.exports = {
    Redirect: Redirect
};