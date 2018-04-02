var apikey = "mTG1xZDZC7R-gIdefVSwhaixToHrJd8z";
var apisecret = "yrgYIWFd5OvheUzrAfiLff0oS9_4XkWF";
var imgUrl;
var image;
var enteredUrl;
var name;
var emotions;

var ref = firebase.database().ref();

// TasteDive Query Object
var facePlusData = {
    happiness: {
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
    sadness: {
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

function adjectivify(noun) {
    if(noun === "happiness") return "Happy";
    if(noun === "neutral") return "Neutral";
    if(noun === "surprise") return "Surprised";
    if(noun === "sadness") return "Sad";
    if(noun === "disgust") return "Disgusted";
    if(noun === "anger") return "Angry";
    if(noun === "fear") return "Scared";
}

function faceHtml(image, emotions) {
    $("#image").attr("src", image);
    for (emotion in emotions) {
        $(`span.${emotion}`).text(`${emotions[emotion]}%`);
        $(`div.${emotion}`).attr("style", `width: ${emotions[emotion]}%`);
    }
}

function highest(emotions) {
    var highest = 0;
    var highestEmotion = "";
    for(emotion in emotions) {
        if(emotions[emotion] > highest) {
            highest = emotions[emotion];
            highestEmotion = emotion;
        }
    }
    return highestEmotion;
}

function makeCard(name, image, tags, emotions, path) {
    var card = $("<li>");
    card.attr("id", path);

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
        var chip = $(`<div class="chip">#${tags[i]}</div>`);

        chip.data("image", image);
        chip.data("emotions", emotions);
        title.append(chip);
    }
    span.append(img, title);
    body.append(span);

    card.append(header, body);
    if ($(".collapsible").children().length > 3) {
        var id = $(".collapsible").children().first().attr("id");
        $(".collapsible").children().first().remove();
        ref.child(id).remove();
    }
    $(".collapsible").append(card);
}

$("#submit").on("click", function () {
    var form;
    name = $("#user-name").val();
    imgUrl = $("#url").val();
    if (imgUrl === "") enteredUrl = false;
    else enteredUrl = true;
    if (!enteredUrl) {
        form = new FormData($("form")[0]);
    }
    else {
        form = new FormData();
    }

    form.append("api_key", "mTG1xZDZC7R-gIdefVSwhaixToHrJd8z");
    form.append("api_secret", "yrgYIWFd5OvheUzrAfiLff0oS9_4XkWF");
    form.append("image_url", imgUrl);
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
        emotions = JSON.parse(response).faces[0].attributes.emotion;
        if(enteredUrl) faceHtml(imgUrl, emotions);
        else faceHtml(image, emotions);
        tasteDive(highest(emotions));
    });

    $("#favorite").attr("style", "display:default");
    $("#url").val("");
    $("#file").val("");
    $("#user-name").val("");
});

// When the favorite button is clicked, save the current image and its data to firebase
$("#favorite").on("click", function () {
    if (enteredUrl) {
        ref.push({
            name: name,
            imgUrl: imgUrl,
            emotions: emotions
        })
    }
    else {
        ref.push({
            name: name,
            imgUrl: image,
            emotions: emotions
        })
    }
});

// Create a new entry in the list when an image is added to the firebase
ref.on("child_added", function(snapshot) {
    var name = snapshot.val().name;
    var image = snapshot.val().imgUrl;
    var emotions = snapshot.val().emotions;
    var chips = [];
    for(emotion in emotions) {
        if(emotions[emotion] > 5) chips.push(adjectivify(emotion));
    }
    makeCard(name, image, chips, emotions, snapshot.key);
});

// Click on a toast to bring back the saved image
$("body").on("click", ".chip", function() {
    $("#favorite").attr("style", "display:none");
    faceHtml($(this).data("image"), $(this).data("emotions"));
    tasteDive(highest($(this).data("emotions")));
});

function tasteDive(emotion) {
    //Use TasteDive to change html for movies
    var a = facePlusData[emotion].movies[0];
    var b = facePlusData[emotion].movies[1];
    var c = facePlusData[emotion].music[0];
    var d = facePlusData[emotion].music[1];
    var e = facePlusData[emotion].books[0];
    var f = facePlusData[emotion].books[1];
    
    $(".results").empty();
    var queryUrl = "https://tastedive.com/api/similar?k=304653-AlltheFe-6FWI7WPC&q=" + a + "%2C" + b + "&info=1&limit=12&type=movies";

    $.ajax({
        url: queryUrl,
        jsonp: "callback",
        dataType: "jsonp",
        data: { format: "json" }
    }).then(function (response) {

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

tasteDive("neutral");

$(document).ready(function () {

    // Collapsing Cards
    $('.collapsible').collapsible();

    // modal
    $('.modal').modal();

    // Tabs with swipeable function
    $('.tabs').tabs({
        swipeable: true,
        responsiveThreshold: Infinity
    });

});
