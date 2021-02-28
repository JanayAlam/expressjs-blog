window.onload = function () {
    const review = document.getElementById('review');

    review.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            if (e.target.value) {
                const body = e.target.value;
                const data = {
                    body: body ? body : '',
                };
                const profileId = review.dataset.profile;
                const URL = `/api/review/${profileId}`;
                const req = requestGenerator(URL, 'PATCH', data);

                fetch(req)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
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
};

/**
 * Request Object Generator
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
