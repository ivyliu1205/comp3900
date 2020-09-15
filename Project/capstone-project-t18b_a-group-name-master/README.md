# A Group Name - MealMatch

## Current tree hierarchy of BACKEND

    Backend
    ├── Apps
    │   ├── recipes
    │   │   ├── __init__.py
    │   │   ├── admin.py
    │   │   ├── apps.py
    │   │   ├── migrations
    │   │   │   └── __init__.py
    │   │   ├── models.py
    │   │   ├── tests.py
    │   │   └── views.py
    │   └── users
    │       ├── __init__.py
    │       ├── admin.py
    │       ├── apps.py
    │       ├── migrations
    │       │   └── __init__.py
    │       ├── models.py
    │       ├── tests.py
    │       └── views.py
    ├── MealMatchServer
    │   ├── __init__.py
    │   ├── __pycache__
    │   │   ├── __init__.cpython-38.pyc
    │   │   ├── settings.cpython-38.pyc
    │   │   ├── urls.cpython-38.pyc
    │   │   └── wsgi.cpython-38.pyc
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    ├── db.sqlite3
    └── manage.py

### Explanations about the hierarchy
- **Backend**: 
    store the whole Django framework
    - **MealMatchServer**:  
        the main server of the project
    - **Apps**:  
        stores all web apps
        -   **users**: applications about users (e.g. login, register, etc.)
        -   **recipes**: applications about recipes (e.g. add new recipes, delete recipes, etc.)

### Run the project

    python3 manage.py runserver 0.0.0.0:8888

### Create new app

    cd Apps  
    django-admin startapp APP_NAME

### Manage as a super administor ( /admin )

-   Username: admin  
-   Email: super@admin.com
-   Password: 123456
