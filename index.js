const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany()
  })
  .then(() => {
    // Run your code here, after you have insured that the connection was made
    let newRecipe = {
      title: "cheesecake",
      level: "Amateur Chef",
      ingredients: ["cheese", "sugar", "sour cream", "eggs"],
      cuisine: "Greek",
      dishType: "dessert",
      duration: 100,
      creator: "Emon"
    }

    return Recipe.create(newRecipe)
  })
  .then(newRecipeFromDB => console.log(`New recipe: ${newRecipeFromDB.title}`))
  .then(() => Recipe.insertMany(data))
  .then(recipesFromDB => {
    recipesFromDB.forEach(singleRecipe => console.log(`Inserted: ${singleRecipe.title}`));

    return Recipe.findOneAndUpdate(
      {title: "Rigatoni alla Genovese"}, 
      { duration: 100 }, 
      { new: true }
    )
  })
  .then(updatedRecipeFromDB => {
    console.log(`Updated: ${updatedRecipeFromDB.title} with new duration: ${updatedRecipeFromDB.duration}`)
    return Recipe.deleteOne({ title: "Carrot Cake" })
  })
  .then(() => console.log("Deleted Carrot Cake!"))
  .catch(error => {
    console.error('Error connecting to the database', error);
  })
  .finally(() => mongoose.connection.close())