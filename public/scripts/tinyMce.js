window.onload = function () {
    tinymce.init({
        selector: '#tiny-mce-post-body',
        height: 500,
        plugins:
            'advlist lists link autosave autolink code preview searchreplace wordcount table emoticons image imagetools',
        toolbar:
            'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | link image | forecolor backcolor emoticons | code preview searchreplace',
        automatic_uploads: true,
        images_upload_url: '/uploads/post-image',
        relative_urls: false,
        images_upload_handler: function (blobInfo, success, failer) {
            let header = new Headers();
            header.append('Accept', 'Application/JSON');

            let formData = new FormData();
            formData.append('post-image', blobInfo.blob(), blobInfo.filename());

            let req = new Request('/uploads/post-image', {
                method: 'POST',
                headers: header,
                mode: 'cors',
                body: formData,
            });

            fetch(req)
                .then((res) => res.json())
                .then((data) => success(data.imgUrl))
                .catch((e) => failer('HTTP ERROR'));
        },
    });
};
