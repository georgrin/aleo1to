import axios from "axios";

export async function getInfo() {
    return await axios.get(`/api/info`).then(request => request.data);
}

export async function getHistoryInfo() {
    return await axios.get(`api/history/info`).then(request => request.data);
}
