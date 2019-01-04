// TODO: add your JavaScript here!
const req = new XMLHttpRequest();
let url = 'http://localhost:3000/api/places';

//function for updating table
function tableUpdate(url){
	if(document.querySelectorAll('h3').length > 1){
		document.body.removeChild(document.querySelectorAll('h3')[1]);
	}

	req.open('GET', url, true);
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400){
			const data = JSON.parse(req.responseText);
			const placeslist = document.getElementById('places-list');
			while (placeslist.hasChildNodes()) {
				placeslist.removeChild(placeslist.lastChild);
			}

			data.forEach(function(ele) {
				const row = placeslist.appendChild(document.createElement('tr'));
				const name = row.appendChild(document.createElement('td'));
				name.textContent = ele.name;
				const cuisine = row.appendChild(document.createElement('td'));
				cuisine.textContent = ele.cuisine;
				const location = row.appendChild(document.createElement('td'));
				location.textContent = ele.location;
			});
		}
	});

	req.send();
}

function handleFilter(event){
 //alert('click');
	event.preventDefault();

	const filterLocation = document.querySelector('input[name="location"]').value;
  console.log(filterLocation);
	const filterCuisine = document.querySelector('select[name="cuisine"]').value;
  console.log(filterCuisine);

	if(filterLocation && filterCuisine !== ""){
		url = 'http://localhost:3000/api/places?location='+filterLocation+'&cuisine='+filterCuisine;
	}
	else if(filterLocation){
		url = 'http://localhost:3000/api/places?location='+filterLocation;
	}
	else if(filterCuisine !==""){
		url = 'http://localhost:3000/api/places?cuisine='+filterCuisine;
	}
	else{
		url = 'http://localhost:3000/api/places';
	}

	const filter = document.getElementById('filter');
	filter.reset();

	tableUpdate(url);
}

 function handlePlaceAdding(event){
  //alert('click');
	event.preventDefault();
	const addName = document.getElementById('name').value;
	const addLocation = document.getElementById('location').value;
	const addCuisine = document.querySelectorAll('select[name="cuisine"]')[1].value;
	if(addName === '' || addLocation === ''){
		const warning = document.body.appendChild(document.createElement('h3'));
		warning.textContent = 'all form fields must be filled';
	}
	else{
		const postReq = new XMLHttpRequest();
		postReq.open('POST', 'http://localhost:3000/api/places/create', true);
		postReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

		postReq.addEventListener('load', function(){
			if (postReq.status >= 200 && postReq.status < 400){
				if(postReq.responseText === 'No duplicates allowed'){
					const warning = document.body.appendChild(document.createElement('h3'));
					warning.textContent = 'Error: No duplicates allowed.';
				}
			}
		});

		postReq.send('name=' + addName + '&location=' + addLocation + '&cuisine=' + addCuisine);

		const post = document.getElementById('form');
		post.reset();

		url = 'http://localhost:3000/api/places';
		tableUpdate(url);
	}
}

function main() {
    console.log('loaded');
    const addBtn = document.querySelector('#addBtn');
    const filterBtn = document.querySelector('#filterBtn');
    //console.log(btn);
    addBtn.addEventListener('click', handlePlaceAdding);
    filterBtn.addEventListener('click', handleFilter);
    tableUpdate(url);
}
document.addEventListener("DOMContentLoaded", main);
