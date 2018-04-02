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
    happy: {
        music: ["the+gorillas", "Jackson+5"],
        movies: ["The+Pursuit+of+Happiness", "School+of+Rock"],
        books: ["Where+the+sidewalk+ends", "book:eat+pray+love"]
    },
    neutral: {
        music: ["Sweet+Disposition", "Crystalised"],
        movies: ["Love+actually", "Valentines+day"],
        books: ["Sherlock+holmes", "Outliers"]
    },
    surprise: {
        music: ["Blue+monday", "Scary+monsters+and+nice+sprites"],
        movies: ["Citizen+kane", "Momento"],
        books: ["The+girl+with+the+dragon+tattoo", "Shutter+island"]
    },
    sad: {
        music: ["Will+the+circle+be+unbroken", "Lego+house"],
        movies: ["Mrs.+Doubtfire", "Marley+and+Me"],
        books: ["The+hitchhikers+guide+to+the+Galaxy", "I+was+told+there'd+be+cake"]
    },
    anger: {
        music: ["Under+the+knife", "Killing+in+the+name+of"],
        movies: ["Anger+management", "The+Hurt+locker"],
        books: ["Anger+taming+a+powerful+emotion", "Seeing+red"]
    },
    fear: {
        music: ["Staralfur", "Unforgettable"],
        movies: ["Remember+the+titans", "Groundhog+day"],
        books: ["The+art+of+war", "A+tale+of+three+kings"]
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
});

// Use TasteDive to change html for movies

var queryUrl = "https://tastedive.com/api/similar?k=304242-AllTheFe-QNCWAHXB&q=" + facePlusData.happy.movies[0] + "%2C" + facePlusData.happy.movies[1] + "&info=1&limit=12&type=movies";

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
var queryUrl = "https://tastedive.com/api/similar?k=304242-AllTheFe-QNCWAHXB&q=" + facePlusData.happy.music[0] + "%2C" + facePlusData.happy.music[1] + "&info=1&limit=12&type=music";

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

var queryUrl = "https://tastedive.com/api/similar?k=304242-AllTheFe-QNCWAHXB&q=" + facePlusData.happy.books[0] + "%2C" + facePlusData.happy.books[1] + "&info=1&limit=12&type=books";

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
