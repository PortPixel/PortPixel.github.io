
//time so far: 1h21



'use strict';
var cl = console.log


var testShopData = {
    name: 'Cambridge Crepes',
    openingHoursAsStrShort: '11-5 Wed to Sun',
    openingHoursAsStrLong: '11-5 Wed to Sun, 7 days per week school holidays',
    headerImageName: 'cambridge-crepes-1.jpg',
    infoAsText: 'We serve optionally gluten & dairy free crepes. Please for further information about allergies and intolerances.',
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


var itemDivs;
function loadShopData (shopData) {
    
    
    
    var mainContainerDiv = document.createElement('div');
    mainContainerDiv.className = 'mainContainerDiv';
    document.body.appendChild(mainContainerDiv);
    
    var headerImageDiv = getHeaderImageDiv(shopData);
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
    var itemDiv;
    
    itemDivs = [];
    for (i = 0; i < menuData.categoryOrder.length; i++) {
        categoryName = menuData.categoryOrder[i];
        
        categoryDiv = getCategoryDiv(menuData.categoryData[categoryName])
        
        mainContainerDiv.appendChild(categoryDiv);
        
        itemsInCategory = getAllMenuItemsInCategory(shopData.menu.items, categoryName)
        
        for (i2 = 0; i2 < itemsInCategory.length; i2++) {
            item = itemsInCategory[i2]
            
            item.shopData = shopData;
            itemDiv = getItemDiv(item, mainContainerDiv);
            categoryDiv.itemsContainerDiv.appendChild(itemDiv)
            itemDivs.push(itemDiv)
        }
    }
    
    var footerDiv = document.createElement('div');
    footerDiv.className = 'footerDiv';
    document.body.appendChild(footerDiv);
    
    var footerInnerContainerDiv = document.createElement('div');
    footerInnerContainerDiv.className = 'footerInnerContainerDiv';
    document.body.appendChild(footerInnerContainerDiv);
    footerInnerContainerDiv.innerHTML = '&middot; &copy;J &middot;'
    footerDiv.appendChild(footerInnerContainerDiv)
    
    mainContainerDiv.appendChild(footerDiv);
    
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



function hideAllShowingItemPopups (itemDivs) {
    var i;
    
    var itemDiv;
    for (i = 0; i < itemDivs.length; i++) {
        itemDiv = itemDivs[i];
        
        if (itemDiv.popupShowing) {
            itemDiv.hidePopup();
        }
    }
}


function getItemDiv (itemData, mainContainerDiv) {
    var itemDiv = document.createElement('div');
    
    itemDiv.className = 'itemDiv';
    
    var itemNameDiv = document.createElement('div');
    itemNameDiv.className = 'itemNameDiv';
    
    var itemPriceDiv = document.createElement('div');
    itemPriceDiv.className = 'itemPriceDiv';
    
    itemPriceDiv.innerHTML = itemData.price;
    itemNameDiv.innerHTML = itemData.name;
    
    itemDiv.mainContainerDiv = mainContainerDiv;
    
    itemDiv.popupShowing = false;
    itemDiv.popupDiv = undefined;
    
    itemDiv.appendChild(itemNameDiv)
    itemDiv.appendChild(itemPriceDiv)
    
    itemDiv.hidePopup = () => {
        itemDiv.mainContainerDiv.removeChild(itemDiv.popupDiv);
        itemDiv.popupShowing = false;
    }
    
    itemDiv.showPopup = () => {
        if (!itemDiv.popupDiv) {
            itemDiv.popupDiv = getItemDataPopupDiv(itemData);
        }
        itemDiv.mainContainerDiv.appendChild(itemDiv.popupDiv);
        itemDiv.popupShowing = true;
    }
    
    itemDiv.onclick = () => {
        if (!itemDiv.popupShowing) {
            hideAllShowingItemPopups(itemDivs);
            itemDiv.showPopup();
        } else {
            itemDiv.hidePopup();
        }
    }
    
    return(itemDiv)
}

function getCategoryDiv (categoryData) {
    var categoryDiv = document.createElement('div');
    
    categoryDiv.className = 'categoryDiv';
    
    var categoryHeadingDiv = document.createElement('div');
    
    categoryHeadingDiv.className = 'categoryHeadingDiv';
    
    categoryHeadingDiv.innerHTML = categoryData.name;
    
    categoryDiv.appendChild(categoryHeadingDiv)
    
    var itemsContainerDiv =  document.createElement('div');
    itemsContainerDiv.className = 'itemsContainerDiv';
    categoryDiv.appendChild(itemsContainerDiv)
    
    categoryDiv.itemsContainerDiv = itemsContainerDiv;
    
    itemsContainerDiv.style.maxHeight = 'unset'
    
    categoryHeadingDiv.onclick = () => {
        var containerDivToToggleShowHide = categoryHeadingDiv.parentElement.itemsContainerDiv;
        if (containerDivToToggleShowHide.style.maxHeight){
            containerDivToToggleShowHide.style.maxHeight = null;
        } else {
            containerDivToToggleShowHide.style.maxHeight = containerDivToToggleShowHide.scrollHeight + "px";
        }
        
    }
    return(categoryDiv)
}

function getHeaderImageDiv (shopData) {
    var headerImageDiv = document.createElement('div');
    
    headerImageDiv.className = 'headerImageDiv';
    
    headerImageDiv.style.backgroundImage = 'url(images/'+ shopData.headerImageName;')';
    
    headerImageDiv.onclick = () => {
        hideAllShowingItemPopups(itemDivs)
    }
    
    
    return(headerImageDiv)
}

function getHeaderDiv (shopData) {
    var headerDiv = document.createElement('div');
    headerDiv.className = 'headerDiv';
    
    var shopNameDiv = document.createElement('div');
    shopNameDiv.className = 'shopNameDiv';
    shopNameDiv.innerHTML = shopData.name;
    headerDiv.appendChild(shopNameDiv);
    
    
    var openingHoursOuterContainerDiv = document.createElement('div');
    openingHoursOuterContainerDiv.className = 'openingHoursOuterContainerDiv';
    headerDiv.appendChild(openingHoursOuterContainerDiv);
    
    var clockSymbolDiv = document.createElement('div');
    clockSymbolDiv.className = 'clockSymbolDiv';
    openingHoursOuterContainerDiv.appendChild(clockSymbolDiv);
    
    var openingHoursDiv = document.createElement('div');
    openingHoursDiv.className = 'openingHoursDiv';
    openingHoursDiv.innerHTML = shopData.openingHoursAsStrShort;
    openingHoursOuterContainerDiv.appendChild(openingHoursDiv);
    
    
    
    var shopInfoOuterContainerDiv = document.createElement('div');
    shopInfoOuterContainerDiv.className = 'shopInfoOuterContainerDiv';
    headerDiv.appendChild(shopInfoOuterContainerDiv);
    
    var clockSymbolDiv = document.createElement('div');
    clockSymbolDiv.className = 'infoSymbolDiv';
    shopInfoOuterContainerDiv.appendChild(clockSymbolDiv);
    
    var shopInfoDiv = document.createElement('div');
    shopInfoDiv.className = 'shopInfoDiv';
    shopInfoDiv.innerHTML = shopData.infoAsText;;
    shopInfoOuterContainerDiv.appendChild(shopInfoDiv);
    
    
    headerDiv.onclick = () => {
        hideAllShowingItemPopups(itemDivs)
    }
    
    return(headerDiv)
}



function getAllergensInfoAsHTMLStr (itemData) {
    var tempStr = '';
    
    switch (itemData.allergens.glutenFree) {
        case 0:
            tempStr += 'Not gluten free';
            break;
        case 1:
            tempStr += 'Gluten free';
            break;
        case 2:
            tempStr += 'Optionally gluten free';
            break;
        default:
            console.error('allergen code not known:' + itemData.allergens.glutenFree)
    }
    
    tempStr += '<br>';
    
    
    switch (itemData.allergens.dairyFree) {
        case 0:
            tempStr += 'Not dairy free';
            break;
        case 1:
            tempStr += 'Dairy free';
            break;
        case 2:
            tempStr += 'Optionally dairy free';
            break;
        default:
            console.error('allergen code not known:' + itemData.allergens.glutenFree)
    }
    
    
    return(tempStr);
}

function getCategoriesAsHTMLStr (itemData) {
    var i;
    var tempStr = '';
    for (i = 0; i < itemData.categories.length; i++) {
        if (i!==0) {
            tempStr += ' | '
        }
        tempStr += itemData.shopData.menu.categoryData[itemData.categories[i]].name;
    }
    return(tempStr);
}


function getItemDataPopupDiv (itemData) {
    
    
    
    var popupItemDivOuterContainer = document.createElement('div');
    popupItemDivOuterContainer.className = 'popupItemDivOuterContainer';
    
    var popupItemDiv = document.createElement('div');
    
    
    var rowBreakerDiv = document.createElement('div');
    rowBreakerDiv.className = 'rowBreakerDiv';
    
    
    popupItemDiv.className = 'popupItemDiv';
    
    popupItemDivOuterContainer.appendChild(popupItemDiv);
    
    var popupItemNameDiv = document.createElement('div');
    popupItemNameDiv.className = 'popupItemNameDiv';
    
    var popupItemPriceDiv = document.createElement('div');
    popupItemPriceDiv.className = 'popupItemPriceDiv';
    
    popupItemPriceDiv.innerHTML = itemData.price;
    popupItemNameDiv.innerHTML = itemData.name;
    
    var popupItemAllergensDiv = document.createElement('div');
    popupItemAllergensDiv.className = 'popupItemAllergensDiv';
    
    popupItemAllergensDiv.innerHTML = getAllergensInfoAsHTMLStr(itemData);
    
    var popupItemCategoriesDiv = document.createElement('div');
    popupItemCategoriesDiv.className = 'popupItemCategoriesDiv';
    popupItemCategoriesDiv.innerHTML = getCategoriesAsHTMLStr(itemData);
    
    popupItemDiv.appendChild(popupItemNameDiv)
    popupItemDiv.appendChild(popupItemPriceDiv)
    popupItemDiv.appendChild(rowBreakerDiv)
    popupItemDiv.appendChild(popupItemCategoriesDiv)
    var rowBreakerDiv = document.createElement('div');
    rowBreakerDiv.className = 'rowBreakerDiv';
    popupItemDiv.appendChild(rowBreakerDiv)
    popupItemDiv.appendChild(popupItemAllergensDiv)
    
    return(popupItemDivOuterContainer);
}



function setup () {
    loadShopData(testShopData)
}
