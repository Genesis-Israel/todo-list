//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://genesis:fire@cluster0.nm1uka5.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = ({
  name: String
})

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Wash your clothes"
});

const item2 = new Item({
  name: "Run few errands"
});

const item3 = new Item({
  name: "Go to the library"
})

const defaultItems = [item1, item2, item3];

const listSchema = ({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, Items){

    if(Items.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err)
        }else{
          console.log("successfully added default items")
          
        }
      });
      res.redirect("/")
    }else{
      const day = date.getDate();

      res.render("list", {listTitle: day, newListItems: Items});
    }

  
  })



});

app.get("/:customListName", function(req, res){
  const customListName = (req.params.customListName)

  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name: customListName,
          items: defaultItems

        });

        list.save();
        res.redirect("/" + customListName)
      }else{
       
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  })
})

app.post("/", function(req, res){

  const newItem = req.body.newItem;

  const item = new Item({
    name: newItem
  });

  item.save();
  res.redirect("/");

});

app.post("/delete", function(req, res){
  const checkedItem = req.body.checkbox
  Item.findByIdAndRemove(checkedItem, function(err){
    if(err){
      console.log(err)
    }else{
      res.redirect('/')
    }
  })
})



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
