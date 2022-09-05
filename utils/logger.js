const util = require ("util");

let logger = {};

// Just keep a color constant
const colors = { 
    info: "\x1b[7;30;42m",
    error: "\x1b[31m",
    warn: "\x1b[33m",
    escape: "\x1b[0m"
};

// Format everything in a clean manner
let format = (color, title, msg) => {
    return util.format("%s[%s%s%s] %s", colors.escape, color, title, colors.escape, msg);
}

// all of the log types
logger.info = (msg) => {
    console.log(format(colors.info, "Info", msg));
}

logger.error = (msg) => {
    console.log(format(colors.error, "Error", msg.message));
}

logger.warn = (msg) => {
    console.log(format(colors.warn, "Warn", msg));
}




module.exports = logger;