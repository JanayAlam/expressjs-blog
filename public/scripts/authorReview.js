window.onload = function () {
    const review = document.getElementById('review');
    const reviewHolder = document.getElementById('review-holder');
    const reviewCounter = document.getElementById('review-counter');

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
                        let reviewElement = createReview(
                            data.body,
                            profileId,
                            data.fullName,
                            data.profilePhoto
                        );
                        reviewHolder.insertBefore(
                            reviewElement,
                            reviewHolder.children[0]
                        );
                        reviewCounter.innerHTML =
                            parseInt(reviewCounter.innerHTML.trim()) + 1;
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

/**
 * Create Review Node
 *
 * Create a div node
 *
 * @param {Object} review
 */
const createReview = (review, authorProfileId, fullName, userProfilePhoto) => {
    const innerHTML = `
        <div class="card-body my-2">
            <div class="media">
                <a href="/author/${authorProfileId}" style="color: #222;">
                    <img class="align-self-start mr-3 rounded-circle" 
                    src="${userProfilePhoto}" 
                    alt="Reviewer Profile Photo" style="width: 45px;">
                </a>
                <div class="media-body">
                <a href="/author/<%= data.from.profile._id %>" style="color: #222;">
                    <h6 class="my-0 font-weight-bold">${fullName}</h6>
                </a>
                <small class="text-muted mt-0 mb-2">a few seconds ago</small>
                <p>${review}</p>
                </div>
            </div>
        </div>
    `;

    let div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = innerHTML;

    return div;
};
