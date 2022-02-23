import config from "./config"
import axios from "axios"

const baseUrl = `https://g.tenor.com/v1/search?key=${config.tenorKey}`
async function getGif(query: string, limit = 1) {
    const res = await axios.get(`${baseUrl}&limit=${limit}&q=${query}`)
    return <string>res.data.results[0].url
}

export default getGif