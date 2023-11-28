let express = require("express"); // installera express
let app = express(); // skapa ett express server-objekt
let port = 8080; // ... som körs på port 8080 // installera mysql
let mysql = require("mysql"); // installera mysql
let path = require("path"); // installera path

let httpServer = app.listen(port, function () {
  console.log(`Webbserver körs på port ${port}`); // samma som "Webbserver körs på port " + port
});

let fs = require("fs"); // installera fs
const { time } = require("console");

app.use(express.urlencoded({ extended: true })); // behövs för att processa data som skickats med POST

//hämtar filer från mappen filer
app.use(express.static('filer'));

//hämtar login.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});




//gör en post request med username och password för att kunna komma till bloggsidan
app.post("/login", function (req, res) {
  let input = req.body;
  let users = fs.readFileSync("users.json").toString();
  users = JSON.parse(users);
  let inloggad = false; 
  let errorMessage = "";
  for (let i in users) {
    if (input.username === users[i].username && input.password === users[i].password) {
      inloggad = true;
      break;
    }
  }
  if (inloggad) {
    let output = "";
    let input = fs.readFileSync("users1.json").toString();
    input = JSON.parse(input);

    for (let i in input) {
      //skriver min output med inläggen från users1.json så att de visas på bloggsidan direkt 
      output += (input[i].timestamp) + "<br><br>";
      output += "<strong>" + input[i].namn + "</strong><br>" + input[i].Email + "<br>" 
        + input[i].Adress + "<br><br>" + input[i].Kommentar + "<br>";
      output += '</div>';  
      output += "<br><br>";
      output += '<div class="inlagg-ram">';
    }

    let html = fs.readFileSync("template.html").toString();
    html = html.replace('***BLOGGINLÄGG***', output);
    res.send(html);
  } else {
    errorMessage = "Fel användarnamn eller lösenord!";
    let loginPage = fs.readFileSync("login.html").toString();
    loginPage = loginPage.replace('<p id="errorMessage"></p>', ''); 
    res.send(loginPage + '<script>setErrorMessage("' + errorMessage + '");</script>');
  }
});



//hämtar nyttinlagg delen från min template.html
app.get("/nyttinlagg", function (req, res) {
    res.sendFile(__dirname + "/template.html");
    }
);

//gör en post request med namn, email, adress och kommentar för att kunna skriva ett nytt inlägg
app.post("/nyttinlagg", function (req, res) {
    let nyttinlagg = req.body;
    nyttinlagg.Kommentar = begransaOrd(nyttinlagg.Kommentar, 200);
    nyttinlagg.timestamp = new Date();
    let input = fs.readFileSync("users1.json").toString();
    input = JSON.parse(input);
    input.push(nyttinlagg);
    input.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    fs.writeFileSync("users1.json", JSON.stringify(input));
    let output = "";
    for (let i in input){
      //när man skriver ett nytt inlägg så skrivs det ut på bloggsidan och uppdateras direkt
       output += (input[i].timestamp) + "<br><br>";
        output += "<strong>" + input[i].namn + "</strong><br>" + input[i].Email + "<br>" 
        + input[i].Adress + "<br><br>" + input[i].Kommentar + "<br>";
        output += '</div>'; 
        output += "<br><br>";
        output += '<div class="inlagg-ram">';
    }

    //hämtar template.html och ersätter ***BLOGGINLÄGG*** med output
    let html = fs.readFileSync("template.html").toString();
    html = html.replace('***BLOGGINLÄGG***', output);
    res.send(html);
    });
  
    function begransaOrd(text, maxOrd) {
      let ord = text.split(/\s+/);
      if (ord.length > maxOrd) {
          return ord.slice(0, maxOrd).join(" ");
      }
      return text;
  }

  // Function to update the likes count in the UI












