
// URL Google Apps Script (Akan diisi oleh user)
const API_URL = "https://script.google.com/macros/s/AKfycbxzTi6OY3oWgoqgEgBjLersWi22XcM_57Dd2wfc3zITHZ2mXQE62S-wPjnC5XLJ4RJ_qg/exec";

/**
 * Fungsi helper untuk melakukan request ke Google Apps Script
 * @param {string} action - Nama action (misal: 'getUsers', 'addLaporan')
 * @param {object} params - Parameter tambahan untuk request
 */
const fetchAPI = async (action, params = {}, method = 'GET') => {
    if (API_URL.includes("GANTI_DENGAN")) {
        console.warn("API URL belum diset!");
        return { status: 'error', message: 'API URL belum diset' };
    }

    try {
        const options = {
            method: method,
        };

        let url = API_URL;

        if (method === 'GET') {
            const queryParams = new URLSearchParams({ action, ...params });
            url += `?${queryParams.toString()}`;
        } else {
            const formData = new URLSearchParams();
            formData.append('action', action);
            Object.keys(params).forEach(key => {
                formData.append(key, params[key]);
            });
            options.body = formData;
        }

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API Error:", error);
        return { status: 'error', message: error.toString() };
    }
};

export const api = {
    // --- USERS ---
    getUsers: () => fetchAPI('getUsers', {}, 'GET'),
    addUser: (data) => fetchAPI('addUser', data, 'POST'),
    updateUser: (uid, data) => fetchAPI('updateUser', { uid, ...data }, 'POST'),

    // --- LAPORAN ---
    getLaporan: () => fetchAPI('getLaporan', {}, 'GET'),
    addLaporan: (data) => fetchAPI('addLaporan', data, 'POST'),
    updateLaporan: (report_id, data) => fetchAPI('updateLaporan', { report_id, ...data }, 'POST'),
    deleteLaporan: (report_id) => fetchAPI('deleteLaporan', { report_id }, 'POST'),

    // --- SEKOLAH ---
    getSekolah: () => fetchAPI('getSekolah', {}, 'GET'),
    updateSekolah: (data) => fetchAPI('updateSekolah', data, 'POST'),

    // --- KELAS ---
    getKelas: () => fetchAPI('getKelas', {}, 'GET'),
    addClass: (data) => fetchAPI('addClass', data, 'POST'),
    updateClass: (id, data) => fetchAPI('updateClass', { id, ...data }, 'POST'),
    deleteClass: (id) => fetchAPI('deleteClass', { id }, 'POST')
};
