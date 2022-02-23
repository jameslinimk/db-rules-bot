"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const axios_1 = require("axios");
const baseUrl = `https://g.tenor.com/v1/search?key=${config_1.default.tenorKey}`;
async function getGif(query, limit = 1) {
    const res = await axios_1.default.get(`${baseUrl}&limit=${limit}&q=${query}`);
    return res.data.results[0].url;
}
exports.default = getGif;
//# sourceMappingURL=tenor.js.map