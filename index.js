const body = document.querySelector('body');
const subCard = document.querySelectorAll('.sub-card');
const searchBar = document.querySelector('#searchbar');
const theme = document.querySelector('.theme');
const settings = document.querySelector('.settings');
const settingsBody = document.querySelector('.settings-body');
const labels = settingsBody.querySelectorAll('label');
const radios = settingsBody.querySelectorAll('input[type="radio"]');
let unit = document.querySelector('input[name="unit"][checked]').value;
const units = {
    'metric': ['<sup>o</sup>C','m/s'],
    'imperial': ['<sup>o</sup>F', 'mph']
};
const icons = {
    'Clear': 'fa-solid fa-sun',
    'Clouds': 'fa-solid fa-cloud',
    'Drizzle': 'fa-solid fa-cloud-sun-rain',
    'Rain': 'fa-solid fa-cloud-showers-heavy',
    'Thunderstorm': 'fa-solid fa-bolt-lightning',
    'Snow': 'fa-solid fa-snowflake',
    'Atmosphere': 'fa-solid fa-smog' 
};
const week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

class Store {
    static save(key, item){
        localStorage.setItem(key,JSON.stringify(item));
    }
    static load(key){
        if(localStorage.getItem(key)){
            const item = JSON.parse(localStorage.getItem(key));
            return item;
        }
    }
}

// default call values set to new york
let cityName = 'New York';
let lat = '40.7127281', lon = '-74.0060152';
const apiKey = '';

// defaults

if(Store.load('theme')){
    theme.querySelector('i').className = Store.load('theme').class;
    body.style.backgroundImage = Store.load('theme').style;
}

if(Store.load('unit')){
    unit = Store.load('unit')['unit'];
    radios.forEach(r => {
        r.removeAttribute('checked');
        
        if(r.value == unit){
            r.setAttribute('checked',true);
        }
    });
}

if(Store.load('city')){
    cityName = Store.load('city').name;
    lat = Store.load('city').lat;
    lon = Store.load('city').lon;
}



// default api call (new york / stored city)

apiCall();


// events

radios.forEach(radio => {
    radio.addEventListener('click', () => {
        radios.forEach(r => {
            r.removeAttribute('checked');
        });
        radio.setAttribute('checked',true);
        unit = document.querySelector('input[name="unit"][checked]').value;

        const unitObj = {
            'unit': unit
        }
        Store.save('unit',unitObj);

        apiCall();
    });
});

subCard.forEach(card => {
    card.addEventListener('click',e => {
        for(let div of card.children){
            if (div.classList.contains('hidden')){

                if(div.classList.contains('unhidden')){
                    div.classList.remove('unhidden');
                    card.style.marginBlockEnd = "0vh";
                    card.style.blockSize = "28vh";

                } else {
                    div.classList.add('unhidden');
                    card.style.transition = "block-size 200ms ease-in-out, transform 200ms ease-in-out";
                    card.style.marginBlockEnd = "10vh";
                    card.style.blockSize = "38vh";

                }
                
            }
        }
    });
});

theme.addEventListener('click', () => {

    for(let child of theme.children){

        if(child.classList.contains('fa-sun')){

            child.classList.remove('fa-sun');
            child.classList.add('fa-moon');
            body.style.backgroundImage = "linear-gradient(var(--dark-bg-color-primary),var(--dark-bg-color-secondary))";

            
        } else if(child.classList.contains('fa-moon')){

            child.classList.remove('fa-moon');
            child.classList.add('fa-sun');
            body.style.backgroundImage = "linear-gradient(var(--bg-color-primary),var(--bg-color-secondary))";

        }

        const themeObj = {
            'class': child.className,
            'style': body.style.backgroundImage
        }
        Store.save('theme', themeObj);
        
    }
});

settings.addEventListener('click', () => {
    // const settingsBody = document.querySelector('.settings-body');

    if(settingsBody.style.opacity == 0){
        settingsBody.style.opacity = 1;
        settingsBody.style.blockSize = '15ch';
        settingsBody.style.transform = 'translateX(calc(100vw - 20ch) ) translateY(-5vh)';
        settingsBody.style.transition = 'opacity 500ms ease-in-out, transform 500ms ease-in-out';

        settings.style.transform = "scale(1.1)";
        settings.style.transition = "transform 200ms ease-in-out";

        for(let child of settings.children){

            if(child.classList.contains('fa-gear')){
                child.style.animation = "rotation 5000ms linear infinite";
            }
        }
    } else if (settingsBody.style.opacity == 1){
        settingsBody.style.opacity = 0;
        settingsBody.style.blockSize = '0';
        settingsBody.style.transform = 'translateX(calc(100vw - 20ch)) translateY(-100%)';
        settingsBody.style.transition = 'opacity 500ms ease-in-out, transform 500ms ease-in-out, block-size 0ms ease-in-out 600ms';

        settings.style.transform = "";
        settings.style.transition = "";

        for(let child of settings.children){

            if(child.classList.contains('fa-gear')){
                child.style.animation = "";
            }
        }
    }
});

searchBar.addEventListener('keyup', (e) => {

    cityName = searchBar.value;
    
    if(e.code == 'Enter'){
        const ul = document.querySelector('.results');
        const cityRequest = new Request(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`);


        // delete previous results
        removeChildren(ul);

        // api call
        fetch(cityRequest)
        .then( response => {
            return response.json();
        })
        .then(city => {
            for(let c of city){
                const li = document.createElement('li');

                li.textContent = `${c.name}, ${c.country}`;
                li.classList.add('clickable');
                li.addEventListener('click', () => {
                    
                    // when you choose city, the suggestions are removed
                    // and the searchbar is emptied
                    removeChildren(ul);
                    searchBar.value = '';
                    Store.save('city', c);

                    cityName = c.name;
                    lat = c.lat, lon = c.lon;
                    
                    apiCall();
                    
                });
                ul.appendChild(li);
            }

        });
    }

    
});


// helpful functions

function findChild(parent, className){
    for(let div of parent.children){
        if(div.classList.contains(className)){
            return div;
        }
    }
}

function setNumberUnitDiv(parent, value){
    setNumberDiv(parent,value);
    setUnitDiv(parent);
};

function setNumberDiv(parent, value){
    for(let div of parent.children){

        if(div.classList.contains('number')){
            div.textContent = Math.round(value);
            break;
        }
    }
};

function setUnitDiv(parent){
    for(let div of parent.children){

        if(div.classList.contains('unit')){
            
            if(parent.classList.contains('wind')){

                div.innerHTML = units[unit][1];
            } else {

                div.innerHTML = units[unit][0];
            }
            break;
        }
    }
};

function setWeatherDiv(parent, value){
    const i = parent.querySelector('i');

    if(value in icons){
        i.className = icons[value];
        parent.title = value;
    }
};

function removeChildren(parent){
    if(parent.children){
        for(let child of parent.children){
            parent.removeChild(child);
        }
    }
}

function updateCards(weatherObj, cityObjName){
    // main card
    const mainCard = document.querySelector('.main-card');
    const cityName = mainCard.querySelector('.city');
    const realFeel = mainCard.querySelector('.real-feel');
    const maxTemp = mainCard.querySelector('.max-temp');
    const minTemp = mainCard.querySelector('.min-temp');
    const temp = mainCard.querySelector('.temp');
    const humidity = mainCard.querySelector('.humidity');
    const wind = mainCard.querySelector('.wind');
    const weather = mainCard.querySelector('.weather');

    cityName.textContent = cityObjName;
    setNumberUnitDiv(realFeel, weatherObj.current.feels_like);
    setNumberUnitDiv(maxTemp, weatherObj.daily[0].temp.max);
    setNumberUnitDiv(minTemp, weatherObj.daily[0].temp.min);
    setNumberUnitDiv(temp, weatherObj.current.temp);
    setNumberDiv(humidity, weatherObj.current.humidity);
    setNumberUnitDiv(wind, weatherObj.current.wind_speed);
    setWeatherDiv(weather,weatherObj.current.weather[0].main);


    // sub cards
    for(let j = 0; j < 6; j++){

        const visible = findChild(subCard[j], 'visible');
        const hidden = findChild(subCard[j], 'hidden');

        // date
        const day = new Date();
        day.setDate(day.getDate() + (j+1));

        const date = findChild(visible, 'date');
        date.textContent = `${week[day.getDay()]} ${months[day.getMonth()]} ${day.getDate()} ${day.getFullYear()}`;

        // max temp min temp weather
        const maxT = findChild(visible, 'max-temp');
        const minT = findChild(visible, 'min-temp');
        const wea = findChild(visible, 'weather');

        setNumberUnitDiv(maxT,weatherObj.daily[j+1].temp.max);
        setNumberUnitDiv(minT,weatherObj.daily[j+1].temp.min);
        setWeatherDiv(wea,weatherObj.daily[j+1].weather[0].main);

        // humidity wind
        const hum = findChild(hidden,'humidity');
        const win = findChild(hidden,'wind');

        setNumberDiv(hum,weatherObj.daily[j+1].humidity);
        setNumberUnitDiv(win,weatherObj.daily[j+1].wind_speed);
    }
}


// api
function apiCall(){
    const weatherRequest = new Request(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`);

    fetch(weatherRequest).then(response => {
        return response.json();
    })
    .then(weatherObj => {
        updateCards(weatherObj, cityName);
    });
}



