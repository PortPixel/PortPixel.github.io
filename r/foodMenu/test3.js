
//time so far: 1h21



'use strict';
var cl = console.log


var testShopData = {
    name: 'Cambridge Crepes',
    openingHoursAsStrShort: '11-5 Wed to Sun',
    openingHoursAsStrLong: '11-5 Wed to Sun, 7 days per week school holidays',
    headerImageName: 'cambridge-crepes-1.jpg',
    menu: {
        categoryOrder: [
            'sweet',
            'extras',
            'drinks',
        ],
        categoryData: {
            sweet: {
                name: 'Sweet',
            },
            extras: {
                name: 'Extras',
            },
            drinks: {
                name: 'Drinks',
            },
        },
        items: [
            {
                name: 'Lemon & Sugar Crepe',
                price: '&pound;3.9',
                allergens: {
                    glutenFree: 2,//0-no,1-yes,2-optional
                    dairyFree: 2,
                },
                categories: ['sweet'],
            },
            {
                name: 'Nutella Crepe',
                price: '&pound;4.2',
                allergens: {
                    glutenFree: 2,
                    dairyFree: 0,
                },
                categories: ['sweet'],
            },
            {
                name: 'Milk Belgian Chocolate Crepe',
                price: '&pound;x.x',
                allergens: {
                    glutenFree: 2,
                    dairyFree: 0,
                },
                categories: ['sweet'],
            },
            {
                name: 'Buckwheat Crepe Base',
                price: '+&pound;0.5',
                allergens: {
                    glutenFree: 1,
                    dairyFree: 1,
                },
                categories: ['extras'],
            },
            {
                name: 'Coca Cola Can',
                price: '&pound;1.2',
                allergens: {
                    glutenFree: 0,
                    dairyFree: 0,
                },
                categories: ['drinks'],
            },
            {
                name: 'Coca Cola Zero Can',
                price: '&pound;1.2',
                allergens: {
                    glutenFree: 0,
                    dairyFree: 0,
                },
                categories: ['drinks'],
            },
            {
                name: 'Diet Coke',
                price: '&pound;1.2',
                allergens: {
                    glutenFree: 0,
                    dairyFree: 0,
                },
                categories: ['drinks'],
            },
            {
                name: 'Fanta Can',
                price: '&pound;1.2',
                allergens: {
                    glutenFree: 0,
                    dairyFree: 0,
                },
                categories: ['drinks'],
            },
            {
                name: '7up Can',
                price: '&pound;1.2',
                allergens: {
                    glutenFree: 0,
                    dairyFree: 0,
                },
                categories: ['drinks'],
            }
        ]
    }
}

function loadShopData (shopData) {
    
    var mainContainerDiv = document.body;
    
    
    var headerImageDiv = getHeaderImageDiv(shopData)
    mainContainerDiv.appendChild(headerImageDiv);
    
    
    var headerDiv = getHeaderDiv(shopData);
    mainContainerDiv.appendChild(headerDiv);
    
    
    var i;
    var menuData = shopData.menu;
    
    var categoryDiv;
    var i2;
    var itemsInCategory
    var item;
    var categoryName;
    for (i = 0; i < menuData.categoryOrder.length; i++) {
        categoryName = menuData.categoryOrder[i];
        
        categoryDiv = getCategoryDiv(menuData.categoryData[categoryName])
        
        mainContainerDiv.appendChild(categoryDiv);
        
        itemsInCategory = getAllMenuItemsInCategory(shopData.menu.items, categoryName)
        
        cl(itemsInCategory)
        for (i2 = 0; i2 < itemsInCategory.length; i2++) {
            item = itemsInCategory[i2]
            categoryDiv.appendChild(getItemDiv(item))
        }
        
    }
    
    
}


function getAllMenuItemsInCategory (items, categoryName) {
    var i;
    
    var itemsInCategory = [];
    var item;
    for (i = 0; i < items.length; i++) {
        item = items[i];
        if (item.categories.includes(categoryName)) {
            itemsInCategory.push(item)
        }
    }
    return(itemsInCategory)
}




function getItemDiv (itemData) {
    var itemDiv = document.createElement('div');
    
    itemDiv.className = 'itemDiv';
    
    var nameDiv = document.createElement('div');
    nameDiv.className = 'nameDiv';
    
    var priceDiv = document.createElement('div');
    priceDiv.className = 'priceDiv';
    // priceDiv.style.float='right';
    
    priceDiv.innerHTML = itemData.price;
    nameDiv.innerHTML = itemData.name;
    
    itemDiv.appendChild(nameDiv)
    itemDiv.appendChild(priceDiv)
    
    return(itemDiv)
}

function getCategoryDiv (categoryData) {
    var categoryDiv = document.createElement('div');
    
    categoryDiv.className = 'categoryDiv';
    
    var categoryHeadingDiv = document.createElement('div');
    
    categoryHeadingDiv.className = 'categoryHeadingDiv';
    
    categoryHeadingDiv.innerHTML = categoryData.name;
    
    categoryDiv.appendChild(categoryHeadingDiv)
    
    return(categoryDiv)
}

function getHeaderImageDiv (shopData) {
    var headerImageDiv = document.createElement('div');
    
    headerImageDiv.className = 'headerImageDiv';
    
    headerImageDiv.style.backgroundImage = 'url(images/'+ shopData.headerImageName;')';
    
    return(headerImageDiv)
}

function getHeaderDiv (shopData) {
    var headerDiv = document.createElement('div');
    headerDiv.className = 'headerDiv';
    
    var shopNameDiv = document.createElement('div');
    shopNameDiv.className = 'shopNameDiv';
    shopNameDiv.innerHTML = shopData.name;
    headerDiv.appendChild(shopNameDiv);
    
    var openingHoursDiv = document.createElement('div');
    openingHoursDiv.className = 'openingHoursDiv';
    openingHoursDiv.innerHTML = shopData.openingHoursAsStrShort;
    headerDiv.appendChild(openingHoursDiv);
    
    return(headerDiv)
}



function setup () {
    loadShopData(testShopData)
}
