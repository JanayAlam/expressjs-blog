let likeBtn = document.getElementById('like-btn');
let dislikeBtn = document.getElementById('dislike-btn');

likeBtn.addEventListener('click', function (e) {
    sendRequest('likes', likeBtn.dataset.post)
        .then((res) => res.json())
        .then((data) => {
            let likeBtnText = data.liked ? 'Liked' : 'Like';
            likeBtnText += ` - ${data.totalLikes}`;
            let dislikeBtnText = 'Dislike';
            dislikeBtnText += ` - ${data.totalDislikes}`;

            likeBtn.innerHTML = likeBtnText;
            dislikeBtn.innerHTML = dislikeBtnText;
        })
        .catch((e) => {
            console.error(e);
            alert(e.response.data.error);
        });
});

dislikeBtn.addEventListener('click', function (e) {
    sendRequest('dislikes', dislikeBtn.dataset.post)
        .then((res) => res.json())
        .then((data) => {
            let likeBtnText = 'Like';
            likeBtnText += ` - ${data.totalLikes}`;
            let dislikeBtnText = data.disliked ? 'Disliked' : 'Dislike';
            dislikeBtnText += ` - ${data.totalDislikes}`;

            likeBtn.innerHTML = likeBtnText;
            dislikeBtn.innerHTML = dislikeBtnText;
        })
        .catch((e) => {
            console.error(e);
            alert(e.response.data.error);
        });
});

function sendRequest(type, postId) {
    let headers = new Headers();
    headers.append('Accept', 'Application/JSON');
    headers.append('Content-Type', 'Application/JSON');

    let req = new Request(`/api/${type}/${postId}`, {
        method: 'GET',
        mode: 'cors',
        headers,
    });

    return fetch(req);
}
