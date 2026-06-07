const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const defaultProducts = [
  // ==================== VEGETABLES (18) ====================
  {
    name: 'Tomato',
    description: 'Fresh, juicy red tomatoes, perfect for salads, sauces, and everyday cooking.',
    price: 40,
    category: 'Vegetables',
    image: 'https://www.shutterstock.com/image-photo/tomat-rampai-cherry-tomatoes-fresh-260nw-2544922109.jpg',
    stock: 100
  },
  {
    name: 'Carrot',
    description: 'Sweet, crunchy, and vitamin-rich organic carrots, harvested fresh.',
    price: 50,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500',
    stock: 80
  },
  {
    name: 'Potato',
    description: 'Versatile and fresh starchy potatoes, perfect for baking, boiling, or frying.',
    price: 30,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500',
    stock: 150
  },
  {
    name: 'Broccoli',
    description: 'High-fiber, nutrient-dense fresh green broccoli crowns, ideal for steaming.',
    price: 90,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=500',
    stock: 60
  },
  {
    name: 'Spinach',
    description: 'Fresh and tender organic spinach leaves, pre-washed and packed with iron.',
    price: 35,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500',
    stock: 50
  },
  {
    name: 'Onion',
    description: 'Crisp red onions with a sharp, sweet flavor, essential for culinary bases.',
    price: 35,
    category: 'Vegetables',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGD7QyAd5yHL_Bl9w7ml1jPuhpJ_mptL108g&s',
    stock: 120
  },
  {
    name: 'Garlic',
    description: 'Pungent and aromatic fresh garlic bulbs, perfect for enhancing flavor.',
    price: 150,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500',
    stock: 90
  },
  {
    name: 'Ginger',
    description: 'Organic ginger root with a spicy kick, great for teas, soups, and curries.',
    price: 180,
    category: 'Vegetables',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fMRipcK4aWSRzrq1u9wqt4H42ro-hWY-fg&s',
    stock: 80
  },
  {
    name: 'Cauliflower',
    description: 'Fresh white cauliflower head, great for roasting, mashing, or currying.',
    price: 60,
    category: 'Vegetables',
    image: 'https://verdimed.com/wp-content/uploads/2021/10/product-cabbage-cauliflower-field.jpg',
    stock: 50
  },
  {
    name: 'Capsicum (Bell Pepper)',
    description: 'Vibrant and sweet green bell peppers, adding crunch to stir-fries.',
    price: 70,
    category: 'Vegetables',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRszkpPcW9SuN0qXjA-O7IdUz7zd9ncwYcBxw&s',
    stock: 70
  },
  {
    name: 'Cabbage',
    description: 'Fresh and leafy green cabbage, great for coleslaws and stir-fries.',
    price: 40,
    category: 'Vegetables',
    image: 'https://blog.lexhealth.com/images/librariesprovider80/blog-post-featured-images/shutterstock_279836759.jpg?sfvrsn=dd2a930b_0',
    stock: 85
  },
  {
    name: 'Lettuce',
    description: 'Crisp and clean romaine lettuce head, perfect for classic Caesar salads.',
    price: 60,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=500',
    stock: 40
  },
  {
    name: 'Green Peas',
    description: 'Sweet and tender shelled green peas, freshly frozen or raw.',
    price: 80,
    category: 'Vegetables',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfnO9dVRQebLDgF8weaBvDU9XH4kpGcrDAaw&s',
    stock: 95
  },
  {
    name: 'Eggplant',
    description: 'Glossy purple eggplants (brinjals) with a tender texture when cooked.',
    price: 45,
    category: 'Vegetables',
    image: 'https://www.treehugger.com/thmb/K0v7mj-MTjEpIENA1hyCoFcfCOk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__mnn__images__2018__06__eggplant-3e0f0e053ba4479d864b97d5c8a2b762.jpg',
    stock: 60
  },
  {
    name: 'Mushroom',
    description: 'Earthy button mushrooms, fresh and ready for sautéing or soups.',
    price: 110,
    category: 'Vegetables',
    image: 'https://www.seriouseats.com/thmb/1ANo7Ajtt3ZyxbvGUTSBMLCIoQU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20251117-SEA-StoringMushrooms-IrvinLin-03-cd78e95a6f594970991a44b01a00bcd6.jpg',
    stock: 45
  },
  {
    name: 'Okra (Lady Finger)',
    description: 'Tender and fresh green okra pods, perfect for curries and stir-fries.',
    price: 50,
    category: 'Vegetables',
    image: 'https://icariivr.org.in/wp-content/uploads/2025/12/Kashi-Sahishnu.png',
    stock: 75
  },
  {
    name: 'Beetroot',
    description: 'Rich red organic beetroots, packed with vitamins and natural sweetness.',
    price: 50,
    category: 'Vegetables',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSKE2uRnre8_xM7xsYy4U6_EvxcD7WGhNySg&s',
    stock: 80
  },
  {
    name: 'Pumpkin',
    description: 'Sweet and earthy pumpkin pieces, great for soups, stews, and baking.',
    price: 40,
    category: 'Vegetables',
    image: 'https://www.bloomslandcare.com/wp-content/uploads/2016/03/Growing-Perfect-Pumpkins.jpg',
    stock: 50
  },

  // ==================== FRUITS (15) ====================
  {
    name: 'Red Apple',
    description: 'Crisp, sweet, and locally harvested fresh red apples. Great for baking.',
    price: 120,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500',
    stock: 120
  },
  {
    name: 'Banana',
    description: 'Fresh yellow Cavendish bananas, high in potassium and naturally sweet.',
    price: 45,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500',
    stock: 200
  },
  {
    name: 'Orange',
    description: 'Sweet and juicy citrus oranges, packed with fresh vitamin C.',
    price: 90,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500',
    stock: 140
  },
  {
    name: 'Strawberry',
    description: 'Fresh organic strawberries, vibrant red and perfect for desserts.',
    price: 150,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500',
    stock: 60
  },
  {
    name: 'Mango',
    description: 'Premium sweet Alphonso mangoes, rich, flavorful, and fiberless.',
    price: 250,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500',
    stock: 70
  },
  {
    name: 'Green Grapes',
    description: 'Seedless crisp green grapes, fresh, sweet, and tangy snack.',
    price: 100,
    category: 'Fruits',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDCO2QDqth_rcVqYESq7Bwo1Rqw-5gcXloog&s',
    stock: 100
  },
  {
    name: 'Watermelon',
    description: 'Vibrant red and refreshing watermelon, perfect sweet summer fruit.',
    price: 70,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
    stock: 40
  },
  {
    name: 'Pineapple',
    description: 'Tangy and sweet tropical pineapple, rich in vitamins and enzymes.',
    price: 80,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500',
    stock: 50
  },
  {
    name: 'Papaya',
    description: 'Sweet ripe papaya with smooth orange flesh, excellent for digestion.',
    price: 60,
    category: 'Fruits',
    image: 'data:image/jpeg;base64,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',
    stock: 55
  },
  {
    name: 'Pomegranate',
    description: 'Fresh ruby-red pomegranate seeds, rich in antioxidants and sweet juice.',
    price: 160,
    category: 'Fruits',
    image: 'data:image/jpeg;base64,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',
    stock: 65
  },
  {
    name: 'Kiwi',
    description: 'Tangy green kiwifruits, sliced and rich in dietary fiber and vitamins.',
    price: 120,
    category: 'Fruits',
    image: 'https://plus.unsplash.com/premium_photo-1674382739482-5d36b98d653a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZydWl0c3xlbnwwfHwwfHx8MA%3D%3D',
    stock: 80
  },
  {
    name: 'Avocado',
    description: 'Creamy Hass avocados, rich in healthy fats, perfect for guacamole.',
    price: 180,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1612506266679-606568a33215?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhY2Fkb3xlbnwwfHwwfHx8MA%3D%3D',
    stock: 45
  },
  {
    name: 'Blueberries',
    description: 'Sweet and juicy fresh blueberries, packed with brain-boosting antioxidants.',
    price: 200,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1594002348772-bc0cb57ade8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZWJlcnJ5fGVufDB8fDB8fHww',
    stock: 50
  },
  {
    name: 'Peach',
    description: 'Velvety sweet peaches with juicy yellow flesh, great for baking.',
    price: 130,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1639588473831-dd9d014646ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVhY2h8ZW58MHx8MHx8fDA%3D',
    stock: 40
  },
  {
    name: 'Plum',
    description: 'Sweet and slightly tart dark plums, fresh and great for raw eating.',
    price: 110,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1564750497011-ead0ce4b9448?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGx1bXxlbnwwfHwwfHx8MA%3D%3D',
    stock: 45
  },

  // ==================== DAIRY (15) ====================
  {
    name: 'Organic Milk',
    description: '100% pasteurized organic whole milk sourced directly from local dairy farms.',
    price: 60,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JnYW5pYyUyMG1pbGt8ZW58MHx8MHx8fDA%3D',
    stock: 80
  },
  {
    name: 'Salted Butter',
    description: 'Rich, creamy salted butter block, perfect for spreading and baking.',
    price: 55,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500',
    stock: 100
  },
  {
    name: 'Cheddar Cheese',
    description: 'Aged sharp cheddar cheese block, perfect for sandwiches and cheese boards.',
    price: 180,
    category: 'Dairy',
    image: 'https://plus.unsplash.com/premium_photo-1691939610797-aba18030c15f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZGRhciUyMGNoZWVzZXxlbnwwfHwwfHx8MA%3D%3D',
    stock: 50
  },
  {
    name: 'Fresh Yogurt',
    description: 'Creamy and smooth unsweetened probiotic yogurt, packed fresh daily.',
    price: 40,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500',
    stock: 120
  },
  {
    name: 'Paneer (Cottage Cheese)',
    description: 'Soft and fresh Indian cottage cheese block, ideal for cooking curries.',
    price: 90,
    category: 'Dairy',
    image: 'https://media.istockphoto.com/id/2209167127/photo/indian-paneer-cheese-made-from-fresh-milk-and-lemon-juice-on-grey-background-copy-space.webp?a=1&b=1&s=612x612&w=0&k=20&c=PAn7GuHgdN5S4hlXW2lQcUV-OGegD5GuLyvKf-fsr4E=',
    stock: 60
  },
  {
    name: 'Mozzarella Cheese',
    description: 'Fresh and soft mozzarella cheese, perfect for pizzas and pasta toppings.',
    price: 210,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGNoZWVzZXxlbnwwfHwwfHx8MA%3D%3D',
    stock: 45
  },
  {
    name: 'Heavy Whipping Cream',
    description: 'Rich whipping cream with high fat content, ideal for desserts.',
    price: 120,
    category: 'Dairy',
    image: 'https://media.istockphoto.com/id/1280981814/photo/white-butter-cream-in-bowl-with-mixer-whisk.jpg?s=612x612&w=0&k=20&c=c9avwoRMMng923Om0IvA_1e8FEHPPqDpGPWVNxrvB9c=',
    stock: 40
  },
  {
    name: 'Sour Cream',
    description: 'Tangy and thick sour cream, excellent topping for baked potatoes.',
    price: 80,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1605883709265-3cc8ca6b3a3c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c291ciUyMGNyZWFtfGVufDB8fDB8fHww',
    stock: 50
  },
  {
    name: 'Greek Yogurt',
    description: 'Thick, creamy plain Greek yogurt, packed with high proteins.',
    price: 75,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1604095853918-1a1823a63dd5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3JlZWslMjB5b2d1cnR8ZW58MHx8MHx8fDA%3D',
    stock: 70
  },
  {
    name: 'Cream Cheese',
    description: 'Smooth and spreadable cream cheese, perfect for bagels and cheesecakes.',
    price: 160,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1759972331751-619cf77d4869?q=80&w=989&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 35
  },
  {
    name: 'Margarine Spread',
    description: 'Plant-based butter alternative spread, smooth and easy to use.',
    price: 50,
    category: 'Dairy',
    image: 'https://media.istockphoto.com/id/1343150527/photo/butter-curl-and-butter-knife-on-a-wooden-cutting-board.jpg?s=612x612&w=0&k=20&c=jv71bL8jowaaFkoYO9-9UEf-VMqaZkqItBOL_zkC1N8=',
    stock: 90
  },
  {
    name: 'Condensed Milk',
    description: 'Sweetened condensed milk, perfect for desserts, fudges, and coffees.',
    price: 95,
    category: 'Dairy',
    image: 'https://media.istockphoto.com/id/1917705758/photo/fresh-condensed-milk-in-the-bowl.jpg?s=612x612&w=0&k=20&c=_h_tyq89SfvgQ1FKHpXcvL1ybTlDSpISXGbYQuXBufY=',
    stock: 80
  },
  {
    name: 'Buttermilk',
    description: 'Traditional refreshing sour buttermilk, great for digestion and baking.',
    price: 30,
    category: 'Dairy',
    image: 'https://media.istockphoto.com/id/1147734015/photo/spiced-buttermilk-indian-traditional-summer-drink.jpg?s=612x612&w=0&k=20&c=Scf3uG88aIkFGzykpsqOPhssoR1wNu5EkFbHiU8F41U=',
    stock: 110
  },
  {
    name: 'Soy Milk',
    description: 'Non-dairy soy milk, plant-based source of protein and calcium.',
    price: 85,
    category: 'Dairy',
    image: 'https://media.istockphoto.com/id/810853070/photo/fresh-raw-vegan-nut-milk.webp?a=1&b=1&s=612x612&w=0&k=20&c=weYs6qfj_ABfVPfXa8rt3QnoWaRspO0wSEjA1QkNKxY=',
    stock: 65
  },
  {
    name: 'Almond Milk',
    description: 'Unsweetened plant-based almond milk, smooth texture, low calories.',
    price: 110,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1760812990908-70aff19fc16e?q=80&w=1243&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 55
  },
  // ==================== SNACKS (6) ====================
  {
    name: 'Potato Chips',
    description: 'Classic salted potato chips, golden-crisp and delicious for parties.',
    price: 30,
    category: 'Snacks',
    image: 'https://media.istockphoto.com/id/527905022/photo/potato-chips.webp?a=1&b=1&s=612x612&w=0&k=20&c=3bCR8bBD5BlnmI1FlXSkP7K6ui8c4d3IZJMWo-1WBmQ=',
    stock: 150
  },
  {
    name: 'Chocolate Chip Cookies',
    description: 'Crunchy chocolate chip cookies baked fresh daily with premium chocolate.',
    price: 50,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
    stock: 100
  },
  {
    name: 'Mixed Roasted Nuts',
    description: 'Premium blend of salted almonds, cashews, and walnuts.',
    price: 220,
    category: 'Snacks',
    image: 'https://media.istockphoto.com/id/1470238523/photo/a-group-of-almonds-pistachios-walnuts-macadamia-cashews.webp?a=1&b=1&s=612x612&w=0&k=20&c=rZuoJJVLYSEE80iBOV8RYqjkknE_BLbAFhZj3XiHzQ4=',
    stock: 80
  },
  {
    name: 'Butter Popcorn',
    description: 'Microwave butter popcorn pack, salty, rich, and perfect for movies.',
    price: 45,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500',
    stock: 110
  },

  {
    name: 'Cheese Crackers',
    description: 'Bite-sized baked cheese crackers, made with real cheddar.',
    price: 40,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500',
    stock: 95
  },
  {
    name: 'Dark Chocolate Bar',
    description: 'Premium 75% dark cocoa chocolate bar, rich and velvety smooth.',
    price: 110,
    category: 'Snacks',
    image: 'https://media.istockphoto.com/id/186690303/photo/close-up-of-opened-chocolate-bar-from-silver-foil.jpg?s=612x612&w=0&k=20&c=MjjnW_ynlpEdhOrrLBfUV1DoKemv9-EfNhYUO1cXOt4=',
    stock: 120
  },

  // ==================== BEVERAGES (8) ====================
  {
    name: 'Orange Juice',
    description: '100% pure squeezed orange juice, cold-pressed, no added sugars.',
    price: 80,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500',
    stock: 90
  },
  {
    name: 'Apple Juice',
    description: 'Naturally sweet and clear organic apple juice, vitamin-C enriched.',
    price: 75,
    category: 'Beverages',
    image: 'https://media.istockphoto.com/id/182398182/photo/apple-juice-being-poured-into-a-glass.webp?a=1&b=1&s=612x612&w=0&k=20&c=tqyZKtN-TR_YXZm1gRSs7Yd6NvMBHafSi6eptMjetMY=',
    stock: 80
  },
  {
    name: 'Cold Brew Coffee',
    description: 'Premium roasted black cold brew coffee bottle, smooth and strong caffeine.',
    price: 110,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500',
    stock: 70
  },
  {
    name: 'Green Tea',
    description: 'Pure green tea, containing high antioxidants and refreshing aroma.',
    price: 120,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500',
    stock: 100
  },

  {
    name: 'Organic Coconut Water',
    description: 'Natural hydrating coconut water, packed fresh directly from green coconuts.',
    price: 70,
    category: 'Beverages',
    image: 'https://media.istockphoto.com/id/1398144577/photo/coconut-juice.webp?a=1&b=1&s=612x612&w=0&k=20&c=cbJ5ES3YaJgVqS2BJGvyzqsnKBrpLradphrQORsoOhc=',
    stock: 90
  },
  {
    name: 'Chocolate Milkshake',
    description: 'Sweet and creamy cocoa milkshake bottle, loved by kids.',
    price: 65,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500',
    stock: 80
  },

  // ==================== BAKERY (8) ====================
  {
    name: 'Fresh Croissants',
    description: 'Golden, flaky, and buttery croissants from our local bakery section.',
    price: 80,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500',
    stock: 50
  },
  {
    name: 'Sourdough Bread',
    description: 'Freshly baked rustic sourdough bread loaf with a thick crust.',
    price: 90,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    stock: 40
  },
  {
    name: 'Blueberry Muffins',
    description: 'Moist and sweet muffins loaded with wild blueberries and sugar crumble.',
    price: 60,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500',
    stock: 55
  },
  {
    name: 'Chocolate Cupcakes',
    description: 'Moist chocolate cupcakes with rich buttercream chocolate frosting.',
    price: 85,
    category: 'Bakery',
    image: 'https://media.istockphoto.com/id/655156000/photo/chocolate-cupcakes-with-peanut-paste-the-old-grunge-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ika_nU8Q6tti9-RzQUeL9r47JJWhO-dMHGD3FmwaiHw=',
    stock: 35
  },
  {
    name: 'Glazed Donuts',
    description: 'Soft ring yeast donuts coated with classic sugar glaze.',
    price: 50,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500',
    stock: 75
  },
  {
    name: 'Whole Wheat Bread',
    description: 'Healthy whole wheat sliced bread loaf, rich in dietary fibers.',
    price: 45,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500',
    stock: 80
  },

  // ==================== MEAT (6) ====================
  {
    name: 'Chicken Breast',
    description: 'Lean, boneless organic chicken breast meat. High quality and fresh.',
    price: 250,
    category: 'Meat',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500',
    stock: 50
  },
  {
    name: 'Ground Beef Lean',
    description: '90% lean ground beef chuck, ideal for burger patties and meatballs.',
    price: 320,
    category: 'Meat',
    image: 'https://media.istockphoto.com/id/1226682582/photo/ground-beef.jpg?s=612x612&w=0&k=20&c=_YgHw5Qi65PEoGo9wiViNsMWTs-EZhVYc2yEk6JxMzQ=',
    stock: 40
  },
  {
    name: 'Fresh Pork Chops',
    description: 'Thick-cut bone-in pork chops, juicy and tender for pan-searing.',
    price: 280,
    category: 'Meat',
    image: 'https://images.unsplash.com/photo-1600180786608-28d06391d25c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBvcmslMjBtZWF0fGVufDB8fDB8fHww',
    stock: 35
  },
  {
    name: 'Chicken Wings',
    description: 'Fresh chicken wings, perfect for buffalo wing party appetizers.',
    price: 160,
    category: 'Meat',
    image: 'https://media.istockphoto.com/id/1458268268/photo/raw-chicken-wings-poultry-meat-with-spices-salt-and-pepper-on-gray-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=VIm-asmaAv5y6wM_CP-JKP4D986zs1UQ_BmztxZ2VNo=',
    stock: 80
  },
  {
    name: 'Chicken Drumsticks',
    description: 'Skin-on chicken drumsticks, excellent for roasting or frying.',
    price: 150,
    category: 'Meat',
    image: 'https://images.unsplash.com/photo-1624364543842-b0472614eb68?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGRydW1zdGljayUyMHJhd3xlbnwwfHwwfHx8MA%3D%3D',
    stock: 75
  },
  {
    name: 'Beef Burger Patties',
    description: 'Pre-formed thick beef burger patties, seasoned and grill-ready.',
    price: 220,
    category: 'Meat',
    image: 'https://images.unsplash.com/photo-1612078894671-f11ba41d713e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVlZiUyMGJ1cmdlciUyMHBhdGllcyUyMHJhd3xlbnwwfHwwfHx8MA%3D%3D',
    stock: 45
  },

  // ==================== SEA FOOD (6) ====================
  {
    name: 'Salmon Fillet',
    description: 'Premium wild-caught fresh salmon fillet rich in Omega-3.',
    price: 450,
    category: 'Sea Food',
    image: 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsbW9uJTIwZmlsbGV0JTIwcmF3fGVufDB8fDB8fHww',
    stock: 40
  },
  {
    name: 'Fresh Shrimp',
    description: 'De-veined raw tiger shrimp, perfect for garlic butter sautéing.',
    price: 380,
    category: 'Sea Food',
    image: 'https://images.unsplash.com/photo-1578069744397-2f3942a02a7b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnJlc2glMjBzaHJpbXAlMjByYXd8ZW58MHx8MHx8fDA%3D',
    stock: 60
  },
  {
    name: 'Tuna Steak',
    description: 'Thick yellowfin tuna steaks, sashimi-grade and clean cuts.',
    price: 480,
    category: 'Sea Food',
    image: 'https://media.istockphoto.com/id/1217787707/photo/fresh-bluefin-tuna-loin-in-kitchen.webp?a=1&b=1&s=612x612&w=0&k=20&c=cNZ3mRO38Hse3TVTIKzv2SZZJsp7-29tmrFaQEaE1L4=',
    stock: 30
  },
  {
    name: 'Squid Rings',
    description: 'Clean squid rings (calamari), perfect for crispy frying.',
    price: 250,
    category: 'Sea Food',
    image: 'https://media.istockphoto.com/id/1372580661/photo/squid-cut-into-rings-on-stone-board.jpg?s=612x612&w=0&k=20&c=YT8YEOtA2gk_XQ4AMasu4Y1q-AYAJYs_VwaJmdAy_3Y=',
    stock: 50
  },
  {
    name: 'Cod Fillet',
    description: 'Flaky white cod fish fillets, ideal for fish and chips.',
    price: 310,
    category: 'Sea Food',
    image: 'https://media.istockphoto.com/id/1304611143/photo/icelandic-haddock-fillets.webp?a=1&b=1&s=612x612&w=0&k=20&c=w1t4YqY6dCOPMMxrnTxpKXtMNSjl3dkfSMIcpnUxhj0=',
    stock: 40
  },
  {
    name: 'Lobster Tail',
    description: 'Cold-water lobster tail, sweet meat, ideal for luxury dinners.',
    price: 650,
    category: 'Sea Food',
    image: 'https://media.istockphoto.com/id/636377442/photo/raw-organic-fresh-lobster-tails.jpg?s=612x612&w=0&k=20&c=WCrU9T3X6pBqOpeXCO0Wd0u45GtchEZEP7jRMHVx2b8=',
    stock: 15
  },
  {
    name: 'Fresh Mussels',
    description: 'Black-shell fresh mussels, clean and ready for white wine steaming.',
    price: 190,
    category: 'Sea Food',
    image: 'https://plus.unsplash.com/premium_photo-1674498271189-f412079580c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlc2glMjBtdXNjbGVzJTIwc2VhJTIwZm9vZCUyMHJhd3xlbnwwfHwwfHx8MA%3D%3D',
    stock: 45
  },
  {
    name: 'Fresh Oysters',
    description: 'Half-shell clean oysters, harvested fresh, best served with lemon.',
    price: 320,
    category: 'Sea Food',
    image: 'https://images.unsplash.com/photo-1578882422378-9ed72be08b5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlc2glMjBveXN0ZXJzJTIwcmF3fGVufDB8fDB8fHww',
    stock: 35
  },

  // ==================== GENERAL PRODUCTS (6) ====================
  {
    name: 'Premium Basmati Rice',
    description: 'Long grain aromatic white Basmati rice, aged for excellent fluffiness.',
    price: 110,
    category: 'General Products',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    stock: 200
  },
  {
    name: 'Extra Virgin Olive Oil',
    description: 'Cold-pressed extra virgin olive oil bottle, rich taste for dressings.',
    price: 450,
    category: 'General Products',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
    stock: 100
  },
  {
    name: 'Iodized Table Salt',
    description: 'Finely ground iodized cooking salt, essential kitchen mineral.',
    price: 20,
    category: 'General Products',
    image: 'https://media.istockphoto.com/id/2183966252/photo/salt-packaging-3d-render-illustration-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=hedU1fsrrTk_ZTKghYIYlKmMF-Q_w3Wrtzp_BD3eOhE=',
    stock: 300
  },
  {
    name: 'White Sugar cubes',
    description: 'Granulated pure white cane sugar, essential sweetener for baking.',
    price: 45,
    category: 'General Products',
    image: 'https://images.unsplash.com/photo-1709651808265-977ed7ef78c6?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 250
  },

  {
    name: 'Pure Honey',
    description: '100% pure organic mountain honey, raw and unfiltered.',
    price: 160,
    category: 'General Products',
    image: 'https://images.unsplash.com/photo-1613548058193-1cd24c1bebcf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHVyZSUyMGhvbmV5fGVufDB8fDB8fHww',
    stock: 90
  },
  {
    name: 'Roasted Ground Coffee',
    description: 'Medium-roasted ground coffee bag, rich chocolate notes.',
    price: 210,
    category: 'General Products',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500',
    stock: 80
  },
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/epic-grocery';

async function seedDatabase(uri, label) {
  try {
    console.log(`Seed: Connecting to ${label}...`);
    await mongoose.connect(uri);
    console.log(`Seed: Connected successfully to ${label}.`);

    // Clear existing products
    await Product.deleteMany({});
    console.log('Seed: Cleared old products.');

    // Insert new products
    await Product.insertMany(defaultProducts);
    console.log('Seed: Successfully seeded products database.');

    await mongoose.connection.close();
    console.log('Seed: Connection closed.');
    return true;
  } catch (err) {
    console.error(`Seed: Failed to seed ${label}:`, err.message);
    return false;
  }
}

async function run() {
  const success = await seedDatabase(MONGODB_URI, 'primary URI / Atlas');
  if (!success) {
    console.log('Seed: Attempting local MongoDB fallback seeding...');
    const localSuccess = await seedDatabase('mongodb://127.0.0.1:27017/epic-grocery', 'local MongoDB');
    if (!localSuccess) {
      console.error('Seed: Both Atlas and local MongoDB seed attempts failed.');
      process.exit(1);
    }
  }
  process.exit(0);
}

run();
