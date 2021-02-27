const comment = document.getElementById('comment');
const commentHolder = document.getElementById('comment-holder');

comment.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        if (e.target.value) {
            const body = e.target.value;
            const data = {
                body: body ? body : '',
            };
            const postId = comment.dataset.post;
            const URL = `/api/comments/${postId}`;
            const req = requestGenerator(URL, 'POST', data);

            fetch(req)
                .then((res) => res.json())
                .then((data) => {
                    let commentElement = createComment(data.comment);
                    commentHolder.insertBefore(
                        commentElement,
                        commentHolder.children[0]
                    );
                    e.target.value = '';
                })
                .catch((e) => {
                    console.error(e.message);
                    alert(e.message);
                });
        } else {
            alert('Please enter a valid comment');
        }
    }
});

/**
 * Request object generator
 *
 * Create a request object for sending to the server
 *
 * @param {String} URL where to send the request
 * @param {String} method method name (POST | GET | PUT | PATCH | DELETE)
 * @param {Object} body javascript object which is going to the server
 * @returns {Request} request object
 */
const requestGenerator = (URL, method, body) => {
    let headers = new Headers();
    headers.append('Accept', 'Application/JSON');
    headers.append('Content-Type', 'Application/JSON');

    return new Request(URL, {
        method,
        headers,
        mode: 'cors',
        body: JSON.stringify(body),
    });
};

/**
 * Create Comment
 *
 * Create a div node
 *
 * @param {Object} comment
 */
const createComment = (comment) => {
    const innerHTML = `
        <img 
            src="${comment.user.profilePhoto}"
            class="rounded-circle mx-3 my-3" style="width: 40px;">

        <div class="media-body my-3">
            <p>${comment.body}</p>

            <div class="my-3">
                <input class="form-control" type="text" 
                    placeholder="Press enter to reply" name="reply"
                    data-comment="${comment._id}" />
            </div>
        </div>
    `;

    let div = document.createElement('div');
    div.className = 'media border';
    div.innerHTML = innerHTML;

    return div;
};
