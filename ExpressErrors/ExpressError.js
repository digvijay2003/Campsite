class ExpressError extends Error{
    constructor (message,StatusCode){
        super();
        this.message = message;
        this.StatusCode = StatusCode;
    }
}

module.exports = ExpressError;