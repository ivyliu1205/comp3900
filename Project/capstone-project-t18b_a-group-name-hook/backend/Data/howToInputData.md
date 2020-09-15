# How to import csv data into models

## First step

    python3 manage.py shell

## Second step

    import csv  
    from recipes.models import Category, Cuisine, MealType, Ingredient, Utensil  

## Third step

### Import Category

    path = 'Data/categories.csv'                                                       

    with open(path) as file: 
        reader = csv.reader(file) 
        for row in reader: 
            Category.objects.create( 
                name=row[0] 
            ) 

### Import Cuisine

    path = 'Data/cuisines.csv' 

    with open(path) as file: 
        reader = csv.reader(file) 
        for row in reader: 
            Cuisine.objects.create( 
                name=row[0] 
            ) 


### Import MealType (id > 10000)

#### Create dummy data with id = 10000

    MealType.objects.create(id=10000) 

#### Insert data
    path = 'Data/mealtypes.csv'  

    with open(path) as file: 
        reader = csv.reader(file) 
        for row in reader: 
            MealType.objects.create( 
                name=row[0] 
            ) 

#### Remove dummy data

    MealType.objects.get(id=10000).delete()

### Import Utensil (id > 20000)

#### Create dummy data with id = 20000

    Utensil.objects.create(id=20000) 

### Import Ingredient

    path = 'Data/ingredients.csv'  

    with open(path) as file: 
        reader = csv.reader(file) 
        for row in reader: 
            Ingredient.objects.create( 
                name=row[0],
                id=row[1]
            ) 



## Other operations

### Count the number of data

    ModelName.objects.all().count()

### Remove all the data in a model

    ModelName.objects.all().delete()