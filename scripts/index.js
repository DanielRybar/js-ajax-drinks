"use strict"
let listElement;
let detailElement;
let ulList;
let formik;
let errMess;
let processBtn;
let searchString;

const API = "https://www.thecocktaildb.com/api/json/v1/1/";
let fullUri = API + "search.php?s=" + (searchString !== undefined ? searchString : "a");

const init = () => {
    listElement = document.getElementById("list");
    detailElement = document.getElementById("detail");
    formik = document.getElementById("searchField");;
    processBtn = document.getElementById("process");
    errMess = document.getElementById("errMess");
    processBtn.addEventListener("click", (e) => { e.preventDefault(); } );

    formik.addEventListener("change", () => {
        searchString = formik.value;
        fullUri = API + "search.php?s=" + (searchString !== undefined ? searchString : "a");
        cleanElement(detailElement);
        viewList(fullUri);
    });
    formik.addEventListener("input", () => {
        searchString = formik.value;
        fullUri = API + "search.php?s=" + (searchString !== undefined ? searchString : "a");
        cleanElement(detailElement);
        viewList(fullUri);
    });
    formik.addEventListener("paste", () => {
        searchString = formik.value;
        fullUri = API + "search.php?s=" + (searchString !== undefined ? searchString : "a");
        cleanElement(detailElement);
        viewList(fullUri);
    });
    formik.addEventListener("keypress", () => {
        searchString = formik.value;
        fullUri = API + "search.php?s=" + (searchString !== undefined ? searchString : "a");
        cleanElement(detailElement);
        viewList(fullUri);
    });
    viewList(fullUri);
}

const downloadJSON = (url, callback) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        callback(JSON.parse(xhr.response));
    }
    xhr.open("GET", url);
    xhr.send();
}

const viewList = (url) => {
    downloadJSON(url, (data) => {
        if(Array.isArray(data.drinks)) {
            cleanElement(errMess);
            listElement.innerHTML = "<ul id='ulList'></ul>"; 
            ulList = document.getElementById("ulList");
            for(let drink of data.drinks) {
                let newItem = document.createElement("li");
                newItem.innerText = drink.strDrink;
                ulList.appendChild(newItem);
                let drinkUrl = API + "lookup.php?i=" + drink.idDrink;

                newItem.addEventListener("click", () => {
                    console.log(drinkUrl);
                    loadDrink(drinkUrl);
                });
            }
        }
        else {
            errMess.innerHTML = "<div class='alert alert-danger' role='alert'>Žádné výsledky.</div>";
            cleanElement(listElement);
        }
    });
}

const loadDrink = (url) => {
    downloadJSON(url, (data) => {
        data = data.drinks;
        if(Array.isArray(data)) {
            data = data[0];
        }
        else {
            data = null;
        }
        const ingredients = [];
        for(let i = 1; i <= 15; i++) {
            if(data["strIngredient" + i]) {
                ingredients.push(data["strIngredient" + i]);
            }
        }
        let html = `
            <img src="${data.strDrinkThumb}" alt=${data.strDrink} />
            <ul>
                <li><b>Název:</b> ${data.strDrink}</li>
                <li><b>Kategorie:</b> ${data.strCategory}</li>
                <li><b>Velikost:</b> ${data.strGlass}</li>
                <li><b>Ingredience:</b> ${ingredients}</li>
            </ul>
        `;
        detailElement.innerHTML = html;
    });
}

const cleanElement = (el) => {
    el.innerHTML = "";
}

window.addEventListener("DOMContentLoaded", init);