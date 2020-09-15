# Suggestions of models

## Ingredient

    Ingredient
        id       = models.IntegerField(primary_key=True)
        name     = models.CharField(max_length=200)
        amount   = models.IntegerField(blank=True, null=True)
        unit     = models.CharField(max_length=50, blank=True)
        category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True, default=331)

- **category**:  
    If category field is NULL, set category as 'Other'.  
    If the corresponding category is deleted from database, the category field will set as 'Other' automatically.  

## Category

    Category
        name     = models.CharField(max_length=64,unique=True)

- **id**:  Start from 0.

## Cuisine

    Cuisine
        name     = models.CharField(max_length=64,unique=True)

- **id**:  Starts from 0

## MealType

    MealType
        name     = models.CharField(max_length=64,unique=True)

- **id**:  Starts from 10000

## Utensil

    Utensil
        name     = models.CharField(max_length=64,unique=True)

- **id**:  Starts from 20000

## Recipe

Store details of each recipe

    Recipe
        id         = models.IntegerField(primary_key=True)
        name       = models.CharField(max_length=200, blank=False)
        link       = models.CharField(max_length=200)
        imgSrc     = models.CharField(max_length=200, blank=True, null=True)
        cookTime   = models.IntegerField(blank=True, null=True)
        createdBy  = models.OneToOneField(User, on_delete=models.SET_NULL, blank=True, null=True)
        lastEdit   = models.DateTimeField(auto_now=True)
        public     = models.BooleanField(default=True)
        ingredients = models.ManyToManyField(Ingredient, through='RecipeIngredient')
        cuisines    = models.ManyToManyField(Cuisine)
        mealTypes   = models.ManyToManyField(MealType)
        utensils    = models.ManyToManyField(Utensil)


- **id**:  
    Same as recipe id in Spoonacular
- **cookTime**:  
    In minutes
- **createdBy**:  
    If 'createdBy' field is empty, it means that recipe is created by Spoonacular.
- **public**:  
    True:   Agree to show the recipe to public  
    False:  Disagree to show the recipe to public  
- **lastEdit**:  
    Each time we update the details of the recipe, lastEdit field will update to current time automatically.

## Step

Store detailed descriptions of each step

    Step
        number      = models.SmallIntegerField()
        recipeId   = models.ForeignKey(Recipe, on_delete=models.CASCADE)
        details     = models.TextField()

    primary = ('recipeId', 'number')

- Example:  
    recipeId = 111 and number = 1, represent the first step of recipe 111.
- **recipeId**:  
    If the corresponding recipe is deleted, then all relevant steps will be deleted as well.  

## RecipeIngredient

Store all informations of each ingredient in each recipe

    RecipeIngredient
        recipe     = models.ForeignKey(Recipe, on_delete=models.CASCADE)
        ingredient = models.ForeignKey(Ingredient, on_delete=models.SET_NULL, blank=True, null=True)
        quantity      = models.DecimalField(max_digits=20, decimal_places=2, default=1.00)
    primary_key = ('recipeId', 'ingredientId')

- **recipe**:  
    If the recipe in Recipe table is deleted, the corresponding data in RecipeIngredient table will be deleted as well.
- **ingredient**:  
    If the ingredient in Ingredient table is deleted, the corresponding data in RecipeIngredient table will reset as null.

## User

    User
        email = models.EmailField(verbose_name="email", max_length=60, unique=True)  
        username = models.CharField(max_length=30, unique=True)  
        last_login = models.DateTimeField(verbose_name='last login', auto_now=True)  
        is_admin = models.BooleanField(default=False)  
        is_active = models.BooleanField(default=True)  
        is_superuser = models.BooleanField(default=False)  
 

