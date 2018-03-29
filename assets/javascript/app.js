var apikey = "mTG1xZDZC7R-gIdefVSwhaixToHrJd8z";
var apisecret = "yrgYIWFd5OvheUzrAfiLff0oS9_4XkWF";
var imgUrl;
var image;
var enteredUrl;

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        image = reader.result;
    }
    reader.readAsDataURL(file);
}

function makeCard(name, image, tags) {
    var card = $("<li>");
    var header = $("<div>");
    header.addClass("collapsible-header");
    header.html(`<i class="material-icons">picture_in_picture_alt</i>${name}</div>`);
    var body = $("<div>");
    body.addClass("collapsible-body");

    var span = $("<span>");
    var img = $("<img>");
    img.attr("src", image);
    var title = $("<span>");
    title.addClass("card-title");
    for(var i = 0; i < tags.length; i++) {
        title.append(`<div class="chip">#${tags[i]}</div>`);
    }
    span.append(img, title);
    body.append(span);

    card.append(header, body);
    if($(".collapsible").children().length > 3) {
        $(".collapsible").children().first().remove();
    }
    $(".collapsible").append(card);
}

$("#submit").on("click", function () {
    var form;
    imgUrl = $("#url").val();
    if(imgUrl === "") enteredUrl = false;
    else enteredUrl = true;
    if(!enteredUrl) {
        form = new FormData($("form")[0]);
        $("#image").attr("src", image);
    }
    else {
        form = new FormData();
        form.append("image_url", imgUrl);
        $("#image").attr("src", imgUrl);
    }
    
    form.append("api_key", "mTG1xZDZC7R-gIdefVSwhaixToHrJd8z");
    form.append("api_secret", "yrgYIWFd5OvheUzrAfiLff0oS9_4XkWF");
    form.append("image_url", image);
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
        if(enteredUrl) makeCard("Name", imgUrl, ["happy", "sad"]);
        else makeCard("Name", image, ["happy", "sad"]);
    });

    $("#url").val("");
    $("#file").val("");
});

$(document).ready(function(){

    // Collapsing Cards
    $('.collapsible').collapsible();

  });

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}
