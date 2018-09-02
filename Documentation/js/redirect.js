class Redirect{
    constructor() {
        this.name = localStorage.getItem('title');
        // localStorage.removeItem('title');
    }

}

module.exports = {
    Redirect: Redirect
};