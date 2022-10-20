import yargs from 'yargs'; 

// yargs.parse() is used in register.js as well.
const args = yargs.parse();

let localPort = null;
if (args.local) {
    const localUrl = new URL(args.local);
    localPort = localUrl.port;
}

export const port = localPort || process.env.PORT || 5001;
console.log('Local worker port is ' + port);

