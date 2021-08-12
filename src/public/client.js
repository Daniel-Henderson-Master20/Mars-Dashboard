let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async(root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
    // getRover(store, store.get("selectedRover"))
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS
const Navigation = (state) => {
        const rovers = state.get("rovers")
        return `
		<header>
					<div class="tab">
					${rovers
						.map((rover) => {
							return `<button class="tablinks" onClick="getRover(store, '${rover}')">${rover}</button>`
						})
						.join("")}
					</div>
				</header>
	`
}

// RoverInfo component
const RoverInfo = (roverInfo) => {
	if (roverInfo.isEmpty()) {
		return `<p>Loading...</p>`
	}
	return `
	<section>
		<img src=""/>
	</section>
		<section>
      <h3>${roverInfo.get("name")}</h3>
                <p>Landing Date: ${roverInfo.get("landing_date")}</p>
                <p>Launch Date: ${roverInfo.get("launch_date")}</p>
								<p>Status: ${roverInfo.get("status")}</p>
								<p>Total Images: ${roverInfo.get("total_photos")}</p>
            </section>
	`
}

//Main component
const HomePage = (state) => {
	// const roverInfo = state.get("roverInfo")
	return `
		<main>
						${Greeting(state.get("user").get("name"))}
						${RoverInfo(state.get("roverInfo"))}      
        </main>
	`
}

//Page Component
//Higher Order Function
const Layout = (state, header, main) => {
	return `
		${header(state)}
		${main(state)}
		<footer>Built by Richard</footer>
	`
}

// App Content
// const App = (state) => {
// 	return `
// 				${Layout(state, Navigation, HomePage)}
//     `
// }
// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// // Example API call
const getRover = (state, rover) => {
	fetch(`http://localhost:3000/rover/${rover}`)
		.then((res) => res.json())
		.then((roverInformation) =>
			// console.log("rover:", roverInformation.rover)
			updateStore(state, {
				selectedRover: rover,
				roverInfo: Immutable.Map(roverInformation.rover),
			})
		)
	getRoverImages(state, rover)
}

const getRoverImages = (state, rover) => {
	fetch(`http://localhost:3000/rover/images/${rover}`)
		.then((res) => res.json())
		.then((roverImages) =>
			updateStore(state, {
				roverImages: Immutable.List(roverImages.photos),
			})
		)
}
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    return data
}