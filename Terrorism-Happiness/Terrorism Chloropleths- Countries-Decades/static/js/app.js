let decade = 0;
let decades = ["70","80", "90", "2000", "2010"];
decades.forEach(displayDecade);

function displayDecade() {
   let url = "localhost:5000"
   console.log(url+"/decades/"+decades[decade])
   decade++;  
}
