const debugLabelHierarchy = {
  // Object with Leaf: {name: String, EXTRA_ATTRS}
  ingredients: {
    dietry: [
      {
        name: 'milk'
      },
      {
        name: 'egg'
      },
      {
        name: 'cheddar'
      }
    ],
    vegetables: [
      {
        name: 'lemon'
      }
    ],
    meat: [
      {
        name: 'minced beef'
      },
      {
        name: 'sirloin steak'
      }
    ],
    'Pasta and Rice': [
      {
        name: 'linguine'
      }
    ]
  },
  cuisines: [
    {
      name: 'Chinese'
    },
    {
      name: 'Italian'
    },
    {
      name: 'Western'
    }
  ],
  mealTypes: [
    {
      name: 'breakfast'
    },
    {
      name: 'lunch'
    },
    {
      name: 'dinner'
    },
    {
      name: 'gluten-free'
    }
  ],
  utensils: [
    {
      name: 'wok'
    },
    {
      name: 'kettle'
    },
    {
      name: 'frying pan'
    }
  ]
}

const debugExploreMatchedRecipesResponse = {
  recipes: [
    {
      own: true,
      id: 323,
      creator: "BB",
      name: 'Spaghetti',
      imgSrcs: [require('@/assets/spaghetti1.jpg')],
      ingredients: [
        {
          name: 'linguine',
          quantity: 100,
          unit: 'gram'
        },
        {
          name: 'minced beef',
          quantity: 300,
          unit: 'gram'
        }
      ],
      time: 30,
      cuisines: ['Italian'],
      mealTypes: ['lunch', 'dinner'],
      utensils: ['kettle', 'frying pan']
    },
    {
      id: 334,
      creator: null,
      name: 'Simple sirloin steak',
      imgSrcs: [require('@/assets/sirloin_steak.jpg')],
      ingredients: [
        {
          name: 'sirloin steak',
          quantity: 300,
          unit: 'gram'
        }
      ],
      time: 15,
      cuisines: ['dinner'],
      mealTypes: ['italian'],
      utensils: ['western']
    },
    {
      own: true,
      id: 3232,
      creator: "BB",
      name: 'Spaghetti',
      imgSrcs: [require('@/assets/spaghetti1.jpg')],
      ingredients: [
        {
          name: 'linguine',
          quantity: 100,
          unit: 'gram'
        },
        {
          name: 'minced beef',
          quantity: 300,
          unit: 'gram'
        }
      ],
      time: 30,
      cuisines: ['Italian'],
      mealTypes: ['lunch', 'dinner'],
      utensils: ['kettle', 'frying pan']
    },    {
      own: true,
      id: 3231,
      creator: "BB",
      name: 'Spaghetti',
      imgSrcs: [require('@/assets/spaghetti1.jpg')],
      ingredients: [
        {
          name: 'linguine',
          quantity: 100,
          unit: 'gram'
        },
        {
          name: 'minced beef',
          quantity: 300,
          unit: 'gram'
        }
      ],
      time: 30,
      cuisines: ['Italian'],
      mealTypes: ['lunch', 'dinner'],
      utensils: ['kettle', 'frying pan']
    },
  ],
  suggestedIngredients: ['egg']
}

const debugRecipeDetailsMap = {
  323: {
    id: 323,
    creator: "BB",
    name: 'Spaghetti',
    imgSrcs: [
      require('@/assets/spaghetti1.jpg'),
      require('@/assets/spaghetti2.jpg')
    ],
    ingredients: [
      {
        name: 'linguine',
        quantity: 100,
        unit: 'gram'
      },
      {
        id: 11,
        quantity: 300
      }
    ],
    time: 30,
    cuisines: ['Italian'],
    mealTypes: ['lunch', 'dinner'],
    utensils: ['kettle', 'frying pan'],
    steps: [
      'Boil water with the kettle',
      'Put the pasta in the kettle',
      'Cook the sauce in the fryping pan',
      'Mix the pasta with the sauce in the frying pan'
    ]
  },
  334: {
    id: 334,
    creator: null,
    name: 'Simple sirloin steak',
    imgSrcs: [require('@/assets/sirloin_steak.jpg')],
    ingredients: [
      {
        name: 'sirloin steak',
        quantity: 300,
        unit: 'gram'
      }
    ],
    time: 15,
    cuisines: ['dinner'],
    mealTypes: ['italian'],
    utensils: ['western']
  }
}

const debugProfileDetails = { email: 'DEBUG@debug.com' }

const debugCreatorRecipeDetailsWithoutId = {
  id: 323,
  name: 'Spaghetti',
  imgSrcs: [require('@/assets/spaghetti1.jpg')],
  ingredients: [
    {
      name: 'linguine',
      quantity: 100,
      unit: 'gram'
    },
    {
      name: 'minced beef',
      quantity: 300,
      unit: 'gram'
    }
  ],
  time: 30,
  cuisines: ['Italian'],
  mealTypes: ['lunch', 'dinner'],
  utensils: ['kettle', 'frying pan'],
  steps: [
    'Boil water with the kettle',
    'Put the pasta in the kettle',
    'Cook the sauce in the fryping pan',
    'Mix the pasta with the sauce in the frying pan'
  ]
}

export {
  debugLabelHierarchy,
  debugExploreMatchedRecipesResponse,
  debugRecipeDetailsMap,
  debugProfileDetails,
  debugCreatorRecipeDetailsWithoutId
}
