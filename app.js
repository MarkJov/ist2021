const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

mongoose.connect("mongodb+srv://markicbuvljak:projekatist123@projekatist.voqmj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true
}, function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log("Radi ti baza!!");
    }
});

var gameSchema = new mongoose.Schema({
    title: String,
    creator: String,
    width: Number,
    height: Number,
    fileName: String,
    thumbnailFile: String
});

var Game = mongoose.model("Game", gameSchema);


//Dodavanje igrica u kolekciju u bazi

//Game.create({
//    title: "Learn to Fly 2",
//    creator: "light_bringer777",
//    width: 640,
//    height: 480,
//    fileName: "learntofly2.swf",
//    thumbnailFile: "Learn_To_Fly_2.jpg"
//}, function(error, data) {
//    if (error) {
//        console.log("Problem pri dodavanju dokumenta u bazu!!!")
//        console.log(error);
//    } else {
//        console.log("Podaci su dodati u kolekciju:");
//        console.log(data);
//    }
//})
//
//
//Game.create({
//    title: "Run 3",
//    creator: "player_03",
//    width: 800,
//    height: 600,
//    fileName: "run3.swf",
//    thumbnailFile: "run3.jpg"
//}, function(error, data) {
//    if (error) {
//        console.log("Problem pri dodavanju dokumenta u bazu!!!")
//        console.log(error);
//    } else {
//        console.log("Podaci su dodati u kolekciju:");
//        console.log(data);
//    }
//})
//
//Game.create({
//    title: "Continuity",
//    creator: "glimajr",
//    width: 640,
//    height: 480,
//    fileName: "continuity.swf",
//    thumbnailFile: "booty.png"
//}, function(error, data) {
//    if (error) {
//        console.log("Problem pri dodavanju dokumenta u bazu!!!")
//        console.log(error);
//    } else {
//        console.log("Podaci su dodati u kolekciju:");
//        console.log(data);
//    }
//})

// const games = [{
//     title: "Learn to Fly 2",
//     creator: "light_bringer777",
//     width: 640,
//     height: 480,
//     fileName: "learntofly2.swf",
//     thumbnailFile: "Learn_To_Fly_2.jpg"
// },
// {
//     title: "Run 3",
//     creator: "player_03",
//     width: 800,
//     height: 600,
//     fileName: "run3.swf",
//     thumbnailFile: "run3.jpg"
// },
// {
//     title: "Continuity",
//     creator: "glimajr",
//     width: 640,
//     height: 480,
//     fileName: "continuity.swf",
//     thumbnailFile: "booty.png"
// }
// ]

//Postavlja public folder kao folder za eksterne fajlove
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());

//Postavlja view engine ejs, kao podrazumevanu vrstu podataka za renderovanje
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("homepage");
});

app.get("/game/:id", function(req, res) {
    var id = req.params.id;

    Game.findById(id, function(error, foundGame) {
        if (error) {
            console.log("Nema igrice sa tim id:");
        } else {
            res.render("game", {
                title: foundGame.title,
                creator: foundGame.creator,
                width: foundGame.width,
                height: foundGame.height,
                fileName: foundGame.fileName
            });
        }
    });
});

//Pretraga
//app.get('/search/:title', function(req, res, next) {
//    var title = req.params.title;
//    Game.find({ title: title }, function(err, gamesList) {
//        if (err) {
//            return res.render('game/search', { gamesList: null });
//        } else {
//            res.render('game/search', { gamesList: gamesList });
//        }
//    });
//});

app.get("/game/edit/:id", function(req, res) {
    var id = req.params.id;

    Game.findById(id, function(error, foundGame) {
        if (error) {
            console.log("Nema igrice sa tim id:");
        } else {
            res.render("edit", {
                title: foundGame.title,
                creator: foundGame.creator,
                width: foundGame.width,
                height: foundGame.height,
                id: id
            });
        }
    });
});


app.post("/update/:id", function(req, res) {
    var id = req.params.id;

    Game.findByIdAndUpdate(id, {
        title: req.body.title,
        creator: req.body.creator,
        width: req.body.width,
        height: req.body.height
    }, function(err, updatedGame) {
        if (err) {
            console.log("Nemoguce je izvrsiti update igre");
            console.log(err);
        } else {
            res.redirect("/list");
            console.log("Izvrsen je update na igri: " + updatedGame);
        }
    })
});

app.get("/game/obrisi/:id", function(req, res) {
    var id = req.params.id;

    Game.findByIdAndDelete(id, function(err) {
        if (err) {
            console.log("Greska u brisanju igre!")
            console.log(err);
        } else {
            console.log("Obrisana je igra pod id: " + id);
            res.redirect("/list");
        }
    })
});

app.get("/list", function(req, res) {

    Game.find({}, function(error, games) {
        if (error) {
            console.log("Problem pri povlacenju svih igara iz baze podataka.");
            console.log(error);
        } else {
            res.render("list", {
                gamesList: games
            });
        }
    });

});

app.get("/addgame", function(req, res) {
    res.render("addgame");
});

app.post("/addgame", function(req, res) {
    var data = req.body;

    //   var gameFile = req.files.gameFile;
    //   var imageFile = req.files.imageFile;
    //
    //   gameFile.
    //
    //   gameFile.mv("public/games/" + gameFile.name, function(error) {
    //       if (error) {
    //           console.log("Nije moguce priloziti novi fajl igrice");
    //           console.log(error);
    //       } else {
    //           console.log("Uspesno prilozen fajl od igrice");
    //       }
    //   });
    //
    //   imageFile.mv("public/games/thumbnails/" + imageFile.name, function(error) {
    //       if (error) {
    //           console.log("Nije moguce priloziti sliku.");
    //           console.log(error);
    //       } else {
    //           console.log("Slika je uspesno prilozena");
    //       }
    //   });

    Game.create({
        title: data.title,
        creator: data.creator,
        width: data.width,
        height: data.height,
        fileName: data.fileName,
        thumbnailFile: data.thumbnailFile
    }, function(error, data) {
        if (error) {
            console.log("Postoji problem pri unosu igre u bazu.");
        } else {
            console.log("Igra je uspesno dodata u bazu.");
            console.log(data);
        }

    });
    res.redirect("/list");
});

app.listen("3000", function() {
    console.log("Radi aplikacija. Ima svega!");
});