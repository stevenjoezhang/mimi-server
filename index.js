/*
 * Created by Shuqiao Zhang in 2020.
 * https://zhangshuqiao.org
 */

/*
 * This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 */

const express = require("express");
const os = require("os");
const chalk = require("chalk");

const app = express();
const http = require("http");
const server = http.createServer(app);

class MiServer {
    constructor(config) {
        this.port = config.port;
        this.static = config.static;
        this.validate();
        this.createServer();
    }

    validate() {
        if (!(this.port >= 0 && this.port < 65536 && this.port % 1 === 0)) {
            console.error("[ERROR] `port` argument must be an integer >= 0 and < 65536. Default value will be used.");
            this.port = 8080;
        }
    }

    createServer() {
        server.listen(this.port, () => {
            console.log(chalk.yellow("Server available on:"));
            const ifaces = os.networkInterfaces();
            Object.keys(ifaces).forEach(dev => {
                ifaces[dev].forEach(details => {
                    if (details.family === 'IPv4') {
                        console.log((`  http://${details.address}:${chalk.green(this.port.toString())}`));
                    }
                });
            });
            console.log("Hit CTRL-C to stop the server");
        });

        // Routing
        app.use(express.static(this.static));
    }
}

module.exports = MiServer;
