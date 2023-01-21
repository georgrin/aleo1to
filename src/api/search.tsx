import axios from 'axios';
import { waitTime } from '../helpers/waitTime';

export async function searchAddress(address: string) {
    await waitTime(300)
    return axios.get(`/api/wallets/${address}`).then(request => request.data);
}
