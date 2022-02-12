const myMap = {
	coords: [],
	businesses: [],
	map: {},
	markers: {},
	
	buildMap() {
		this.map = L.map('map', {
		center: this.coords,
		zoom: 11,
		});
		
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '13',
		}).addTo(this.map)
		
		const marker = L.marker(this.coords)
		marker.addTo(this.map).bindPopup('You Are Here').openPopup()
	},

	addMarkers() { // loop through myMap.businesses and set markers based on location
		for (var i = 0; i < this.businesses.length; i++) {
            console.log(this.businesses[i])
            this.markers = L.marker([
                this.businesses[i].geocodes.main.latitude,
                this.businesses[i].geocodes.main.longitude,
            ]).addTo(this.map).bindPopup(`<p1>${this.businesses[i].name}</p1>`)
		}
	},
}
let userCoords = null;
window.onload = async () => {
    myMap.coords = await getCoords();
    myMap.buildMap()
}

async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

let btn = document.querySelector('#submit')
let selectBox = document.querySelector('#locations')
btn.addEventListener('click', async function(event){
    let foursquareData = await getFoursquare(selectBox.value)
    myMap.businesses = foursquareData
    myMap.addMarkers()
})

async function getFoursquare(business) {
    // get foursquare data 
    const options = {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        Authorization: "your foursquare API key here"
        }
    }
    //get location coordinates
    let limit = 5
    let lat = myMap.coords[0]
    let lon = myMap.coords[1]
    let apiPath = `https://api.foursquare.com/v3/places/search?query=${business}&ll=${lat}%2C${lon}&limit=${limit}`
    let response = await fetch(apiPath, options)
    let parsedData = await response.json()
    console.log(parsedData)
    let businesses = parsedData.results
    return businesses
    
}
