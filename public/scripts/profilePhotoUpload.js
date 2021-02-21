window.onload = function () {
    const baseCropping = $('#cropped-image').croppie({
        viewport: {
            width: 400,
            height: 400,
        },
        boundary: {
            width: 500,
            height: 500,
        },
        showZoomer: true,
    });

    function readableFile(file) {
        let reader = new FileReader();
        reader.onload = function (event) {
            baseCropping
                .croppie('bind', {
                    url: event.target.result,
                })
                .then(() => {
                    $('.cr-slider').attr({
                        min: 0.5,
                        max: 1.5,
                    });
                });
        };
        reader.readAsDataURL(file);
    }

    $('#profilePhotoFileUpload').on('change', function (e) {
        if (this.files[0]) {
            readableFile(this.files[0]);
            $('#crop-modal').modal({
                backdrop: 'static',
                keyboard: false,
            });
        }
    });

    $('#cancel-cropping').on('click', function () {
        $('$crop-modal').modal('hide');
        setTimeout(() => {
            baseCropping.croppie('destroy');
        }, 1000);
    });

    $('#upload-image').on('click', function () {
        baseCropping
            .croppie('result', 'blob')
            .then((blob) => {
                let formData = new FormData();
                let file = document.getElementById('profilePhotoFileUpload')
                    .files[0];
                let name = genarateFileName(file.name);
                formData.append('profilePhoto', blob, name);

                let headers = new Headers();
                headers.append('Accept', 'application/json');

                let req = new Request('/uploads/profilePhoto', {
                    method: 'POST',
                    headers,
                    mode: 'cors',
                    body: formData,
                });
                return fetch(req);
            })
            .then((res) => res.json())
            .then((data) => {
                document
                    .getElementById('removeProfilePhoto')
                    .classList.remove('d-none');
                document
                    .getElementById('removeProfilePhoto')
                    .classList.add('d-block');
                document.getElementById('profilePhotoFile').src =
                    data.profilePhoto;
                document.getElementById('profilePhotoFrom').reset();

                $('#crop-modal').modal('hide');
                setTimeout(() => {
                    baseCropping.croppie('destroy');
                }, 1000);
            });
    });
    $('#removeProfilePhoto').on('click', function () {
        const req = new Request('/uploads/profilePhoto', {
            method: 'DELETE',
            mode: 'cors',
        });

        fetch(req)
            .then((res) => res.json())
            .then((data) => {
                document
                    .getElementById('removeProfilePhoto')
                    .classList.remove('d-block');
                document
                    .getElementById('removeProfilePhoto')
                    .classList.add('d-none');
                document.getElementById('profilePhotoFile').src =
                    data.profilePhoto;
                document.getElementById('profilePhotoFrom').reset();
            })
            .catch((e) => {
                alert('Server error occured!');
            });
    });
};

function genarateFileName(fileName) {
    const types = /(.jpeg|.jpg|.png|.gif)/;
    return fileName.replace(types, '.png');
}
