

document.addEventListener('DOMContentLoaded', function() {

  let ingredients = [];
  let ingredientsList = document.getElementById('ingredientList');
    let ingredientInput = document.getElementById('ingredients');

    document.getElementById('add').addEventListener('click', function (e){
        e.preventDefault();
        const newIngredient = ingredientInput.value.trim().toLowerCase();
        
        if (newIngredient && !ingredients.includes(newIngredient)) {
            ingredients.push(newIngredient);
            
            const li = document.createElement('li');
            li.innerHTML = `
                ${newIngredient}
            `;
          
            ingredientsList.appendChild(li);
            ingredientInput.value = ''; 
        }
    });

    document.getElementById('recipeForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (ingredients.length === 0) {
            alert('Please add at least one ingredient');
            return;
        }

        try {
            const ingredientsParam = ingredients.join(',');
            const response = await fetch(`/api/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsParam)}`);
            const recipes = await response.json();
            console.log(recipes);
            const carouselInner = document.getElementById('carouselInner');
            carouselInner.innerHTML = ''; 
            document.getElementById('recipeCarousel').style.backgroundColor = 'black';
            
            recipes.forEach((recipe, index) => {
                const carouselItem = document.createElement('div');
                carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                
                const card = document.createElement('div');
                card.className = 'card mx-auto';
                card.style.width = '18rem';
            
                card.innerHTML = `
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                    </div>
                `;
            
                const cardBody = card.querySelector('.card-body');
            
                const ul = document.createElement('ul');
                ul.className = 'list-group list-group-flush';
                

                if(recipe.unusedIngredients.length > 0){
                    recipe.unusedIngredients.forEach((ingredient) =>{
                        const li = document.createElement('li');
                        li.innerHTML = `${ingredient.original}`;
                        ul.appendChild(li);
                    });
                }
            
                if(recipe.usedIngredients.length > 0) {                               
                    recipe.usedIngredients.forEach((ingredient) => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = ingredient.original;
                        ul.appendChild(li);
                    });
                }
            
                if(recipe.missedIngredients.length > 0) {            
                    recipe.missedIngredients.forEach((ingredient) => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = ingredient.original;
                        ul.appendChild(li);
                    });
                }
            
                cardBody.appendChild(ul);
                carouselItem.appendChild(card);
                carouselInner.appendChild(carouselItem);
            });
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    });
});