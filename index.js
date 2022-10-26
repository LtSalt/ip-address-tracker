// hook up to DOM
const searchBar = document.querySelector("#searchBar");
const searchButton = document.querySelector("#searchButton");
const ipDom = document.querySelector("#ipAddress");
const locationDom = document.querySelector("#location");
const timezoneDom = document.querySelector("#timezone");
const ispDom = document.querySelector("#isp");

// initialize map
let map = L.map('map');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// store searchbar value to keep track of last query
let inputVal = searchBar.value;

// create event listeners
// 1) on button click
searchButton.addEventListener("click", () => {
    if(searchBar.value !== "" && searchBar.value !== inputVal) {
        newSearch(searchBar.value);
    }
})

// 2) on enter key press
searchBar.addEventListener("keydown", (event) => {
    if(event.keyCode === 13 && searchBar.value !== "" && searchBar.value !== inputVal) {
        newSearch(searchBar.value);
    } 
})


// event listener callback: get and set info
const newSearch = async(query) => {
    // set parameters
    const params = {
        apiKey: "at_soxJqFhE1jrKBVeT5mbyTaZyPtXCs"
    }
    const ipRegex4 = new RegExp("^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$")
    const ipRegex6 = new RegExp("^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$")

    // if input value is IP4 or IP6 address, use ip parameter
    if(ipRegex4.test(query) || ipRegex6.test(query))  {
         params.ipAddress = query;
    }

    // else, use domain parameter
    else {params.domain = query}
    
    try {
        // make request
        const response = await axios.get(" https://geo.ipify.org/api/v2/country,city?", {
            params: params
        });

        // destructure relevant info
        const {ip, location, isp} = response.data;
        const {city, region, postalCode, timezone, lat, lng} = location;

        //insert info into text
        ipDom.innerText = ip;
        locationDom.innerHTML = `${city}, ${region}<br>${postalCode}`; 
        timezoneDom.innerText = `UTC ${timezone}`;
        ispDom.innerText = isp;

        // change map view
        map.setView([lat, lng], 13);
        marker = L.marker([lat, lng]).addTo(map);

        // store last query
        inputVal = searchBar.value;
    } catch(error) {
        console.log(error)
        alert("Not a valid request. Try entering an IP4 or IP6 address, or a domain. Or just mind your own business.");
    }
};

// initial info on pageload
newSearch();


