const chalk = require('chalk');

const actionIndicators = {
    insert      : chalk.green('+'),
    update      : chalk.cyan('^'),
    delete      : chalk.grey('-'),   //  Should Not Happen (TM)
    nuke        : chalk.red('-'),
    unnuke      : chalk.green('+'),
    modnuke     : chalk.red('-'),
    delpre      : chalk.red('-'),
    undelpre    : chalk.green('+'),
};

//  A default config. You are encouraged to copy this
//  file and use it as a template for your own style.
//
//  You can then use it as such:
//  ./predb-mon.js my_config.js
//
module.exports = {
    debug : false,
    categoryFilter : /XXX/g, //  drop all XXX shit
    formatter : (msg) => {
        const indicator = actionIndicators[msg.action];
        msg = msg.row;

        //  you could parse the preAt UNIX timestamp with moment for e.g.:
        //const preAt = moment.unix(msg.preAt).format('MMM Do hh:mm a');

        let out = chalk`${indicator} {magenta ${msg.name}} {yellow ${msg.cat}}`;
        if (msg.url) {
            out += chalk`\r\n  {grey >} {white ${msg.url}}`
        }
        return out;
    }
};