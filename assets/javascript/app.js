var apikey = "mTG1xZDZC7R-gIdefVSwhaixToHrJd8z";
var apisecret = "yrgYIWFd5OvheUzrAfiLff0oS9_4XkWF";
var imgUrl;
var image;

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        image = reader.result;
    }
    reader.readAsDataURL(file);
}

$("#submit").on("click", function () {
    imgUrl = $("#url").val();
    var form = new FormData($("form")[0]);

    $("#image").attr("src", image);
    form.append("image_url", imgUrl);
    form.append("api_key", "mTG1xZDZC7R-gIdefVSwhaixToHrJd8z");
    form.append("api_secret", "yrgYIWFd5OvheUzrAfiLff0oS9_4XkWF");
    form.append("return_attributes", "emotion");

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api-us.faceplusplus.com/facepp/v3/detect",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    };

    $.ajax(settings).done(function (response) {
        var emotions = JSON.parse(response).faces[0].attributes.emotion;
        for (emotion in emotions) {
            $(`span.${emotion}`).text(`${emotions[emotion]}%`);
            $(`div.${emotion}`).attr("style", `width: ${emotions[emotion]}%`);
        }
    });
});

$(document).ready(function(){

    // Collapsing Cards
    $('.collapsible').collapsible();

  });
