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

import express from "express";

import os from "os";
import pc from "picocolors";

const app = express();
import http from "http";
const server = http.createServer(app);

class MiServer {
    constructor(config) {
        this.port = config.port;
        this.static = config.static;
        this.app = app;
        this.server = server;
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
        this.server.listen(this.port, () => {
            console.log(pc.yellow("Server available on:"));
            const ifaces = os.networkInterfaces();
            Object.keys(ifaces).forEach(dev => {
                ifaces[dev].forEach(details => {
                    if (details.family === 'IPv4') {
                        console.log((`  http://${details.address}:${pc.green(this.port.toString())}`));
                    }
                });
            });
            console.log("Hit CTRL-C to stop the server");
        });

        this.server.on("error", e => {
            if (e.code === "EADDRINUSE") {
                console.log(pc.yellow("Address already in use, abort."));
                this.server.close();
                process.exit(1);
            }
        });

        // Routing
        this.app.use(express.static(this.static));
    }
}

export default MiServer;
