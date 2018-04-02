var apikey = "mTG1xZDZC7R-gIdefVSwhaixToHrJd8z";
var apisecret = "yrgYIWFd5OvheUzrAfiLff0oS9_4XkWF";
var imgUrl;
var image;
var enteredUrl;


// TasteDive Query Object
var facePlusData = {
    happy: {
        music: ["Vance+joy", "Grouplove"],
        movies: ["The+Birdcage", "School+of+Rock"],
        books: ["The+year+of+yes", "book:eat+pray+love"]
    },
    neutral: {
        music: ["Temper+trap", "Silversun+pickups"],
        movies: ["Big+Fish", "Valentines+day"],
        books: ["book:The+great+gatsby", "The+catcher+in+the+rye"]
    },
    surprise: {
        music: ["The+mars+volta", "Rush"],
        movies: ["The+sixth+sense", "Memento"],
        books: ["book:The+girl+with+the+dragon+tattoo", "book:Shutter+island"]
    },
    sad: {
        music: ["Death+Cab+for+Cutie", "Have+a+nice+life"],
        movies: ["Schindler's+List", "Marley+and+Me"],
        books: ["The+Road", "A+thousand+splendid+suns"]
    },
    anger: {
        music: ["Converge", "Harms+way"],
        movies: ["movie:The+Revenant", "The+Punisher"],
        books: ["book:Game+of+thrones", "book:Gone+girl"]
    },
    fear: {
        music: ["Dragonforce", "Mayhem"],
        movies: ["The+Exorcist", "It"],
        books: ["book:house+of+leaves", "book:american+Psycho"]
    },
    disgust: {
        music: ["insane+Clown+Posse", "Limp+bizkit"],
        movies: ["Eraseshead", "The+Fly"],
        books: ["book:Pet+semetary", "book:The+jungle"]
    }
}

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
    for (var i = 0; i < tags.length; i++) {
        title.append(`<div class="chip">#${tags[i]}</div>`);
    }
    span.append(img, title);
    body.append(span);

    card.append(header, body);
    if ($(".collapsible").children().length > 3) {
        $(".collapsible").children().first().remove();
    }
    $(".collapsible").append(card);
}

$("#submit").on("click", function () {
    var form;
    imgUrl = $("#url").val();
    if (imgUrl === "") enteredUrl = false;
    else enteredUrl = true;
    if (!enteredUrl) {
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
        if (enteredUrl) makeCard("Name", imgUrl, ["happy", "sad"]);
        else makeCard("Name", image, ["happy", "sad"]);
    });

    $("#url").val("");
    $("#file").val("");
});


function tasteDive(a, b, c, d, e, f) {
    //Use TasteDive to change html for movies

    var queryUrl = "https://tastedive.com/api/similar?k=304653-AlltheFe-6FWI7WPC&q=" + a + "%2C" + b + "&info=1&limit=12&type=movies";

    $.ajax({
        url: queryUrl,
        jsonp: "callback",
        dataType: "jsonp",
        data: { format: "json" }
    }).then(function (response) {

        console.log(response.Similar.Info[0].Name);

        for (var i = 0; i < 4; i++) {
            $(".movie1").append(" <div class='col s12'><div class='card blue-grey darken-1'><div class='card-content white-text'><h2>" + response.Similar.Results[i].Name + "</h2><p>" + response.Similar.Results[i].wTeaser + "</p></div></div></div>")
        }

        for (var i = 4; i < 8; i++) {
            $(".movie2").append(" <div class='col s12'><div class='card blue-grey darken-1'><div class='card-content white-text'><h2>" + response.Similar.Results[i].Name + "</h2><p>" + response.Similar.Results[i].wTeaser + "</p></div></div></div>")
        }

        for (var i = 8; i < 12; i++) {
            $(".movie3").append(" <div class='col s12'><div class='card blue-grey darken-1'><div class='card-content white-text'><h2>" + response.Similar.Results[i].Name + "</h2><p>" + response.Similar.Results[i].wTeaser + "</p></div></div></div>")
        }

    })

    // Use TasteDive to change html for music
    var queryUrl = "https://tastedive.com/api/similar?k=304653-AlltheFe-6FWI7WPC&q=" + c + "%2C" + d + "&info=1&limit=12&type=music";

    $.ajax({
        url: queryUrl,
        jsonp: "callback",
        dataType: "jsonp",
        data: { format: "json" }
    }).then(function (response) {

        console.log(response.Similar.Info[0].Name);

        for (var i = 0; i < 4; i++) {
            $(".music1").append(" <div class='col s12'><div class='card blue-grey darken-1'><div class='card-content white-text'><h2>" + response.Similar.Results[i].Name + "</h2><p>" + response.Similar.Results[i].wTeaser + "</p></div></div></div>")
        }

        for (var i = 4; i < 8; i++) {
            $(".music2").append(" <div class='col s12'><div class='card blue-grey darken-1'><div class='card-content white-text'><h2>" + response.Similar.Results[i].Name + "</h2><p>" + response.Similar.Results[i].wTeaser + "</p></div></div></div>")
        }

        for (var i = 8; i < 12; i++) {
            $(".music3").append(" <div class='col s12'><div class='card blue-grey darken-1'><div class='card-content white-text'><h2>" + response.Similar.Results[i].Name + "</h2><p>" + response.Similar.Results[i].wTeaser + "</p></div></div></div>")
        }

    })

    // Use TasteDive to change html for books

    var queryUrl = "https://tastedive.com/api/similar?k=304653-AlltheFe-6FWI7WPC&q=" + e + "%2C" + f + "&info=1&limit=12&type=books";

    $.ajax({
        url: queryUrl,
        jsonp: "callback",
        dataType: "jsonp",
        data: { format: "json" }
    }).then(function (response) {

        console.log(response.Similar.Info[0].Name);

        for (var i = 0; i < 4; i++) {
            $(".book1").append(" <div class='col s12'><div class='card blue-grey darken-1'><div class='card-content white-text'><h2>" + response.Similar.Results[i].Name + "</h2><p>" + response.Similar.Results[i].wTeaser + "</p></div></div></div>")
        }

        for (var i = 4; i < 8; i++) {
            $(".book2").append(" <div class='col s12'><div class='card blue-grey darken-1'><div class='card-content white-text'><h2>" + response.Similar.Results[i].Name + "</h2><p>" + response.Similar.Results[i].wTeaser + "</p></div></div></div>")
        }

        for (var i = 8; i < 12; i++) {
            $(".book3").append(" <div class='col s12'><div class='card blue-grey darken-1'><div class='card-content white-text'><h2>" + response.Similar.Results[i].Name + "</h2><p>" + response.Similar.Results[i].wTeaser + "</p></div></div></div>")
        }

    })
};

tasteDive(facePlusData.happy.movies[0], facePlusData.happy.movies[1], facePlusData.happy.movies[0], facePlusData.happy.movies[1], facePlusData.happy.movies[0], facePlusData.happy.movies[1],);

$(document).ready(function () {

    // Collapsing Cards
    $('.collapsible').collapsible();

    // Tabs with swipeable function
    $('.tabs').tabs({
        swipeable: true,
        responsiveThreshold: Infinity
    });

});

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}
