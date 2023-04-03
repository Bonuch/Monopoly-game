// TODO что это за helper такой с одной неиспользуемой фоукцнией?

import axios from '@/helpers/axios-instance';

// TODO переделать в action of state
export function addFriendRequest(id, callback = null) {
    axios.get('/add-friend', { params: { id: id } }).then(response => {
        if (response.data.message) {
            alert(response.data.message);
        }

        if (callback) {
            callback();
        }
    });
}