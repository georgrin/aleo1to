import axios from "axios";
import { waitTime } from "../helpers/waitTime";

export async function getInfo() {
    await waitTime(300)
    return await axios.get(`/api/info`).then(request => request.data);
}

export async function getHistoryInfo() {
    await waitTime(300)
    return await axios.get(`api/history/info`).then(request => request.data);
}
