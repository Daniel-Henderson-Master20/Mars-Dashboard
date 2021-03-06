let store = {
    selectedRover: '',
    rovers: Immutable.List(['Spirit', 'Opportunity', 'Curiosity'])
}

const root = document.getElementById('root')

const updateStore = (roverName, roverData) => {
    newState = {}
    newState[roverName] = roverData
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async(root, state) => {
    root.innerHTML = App(state)
}

const App = (state) => {
    return `
        <header><h1>Mars Rover Dashboard</h1></header>
        <main>
            <section id="section-me">
            ${wrapInDivFunction(state, 'rover-container', joinMapperFunction,
            state.rovers, roverCardMakerFunction)}
            </section>
        </main>
        <footer>
            <h3>A project by Daniel Henderson Developer</h3>
        </footer>
    `
}

window.addEventListener('load', () => {
    render(root, store)
})

const onClick = (roverName) => {
    document.getElementById("section-me").innerHTML = (`
        <ul class="info-container">
        <li>Rover name: ${roverName}</li>
        <li>Launched from Earth on: ${store[roverName].rover.launch_date}</li>
        <li>Landed on Mars on: ${store[roverName].rover.landing_date}</li>
        <li>Mission status: ${store[roverName].rover.status}</li>
        <div>Latest Photo:<img src= "${store[roverName].img_src}" alt="Latest photo captured by ${roverName} rover" width="500" height="500"></div>
        </ul>
    `)
}

const wrapInDivFunction = (state, divClass, mapperFunction, mapThis, elementMakerFunction) => {
    return (`<div class="${divClass}"> ${mapperFunction(state, mapThis, elementMakerFunction)} </div>`)
}

const joinMapperFunction = (state, mapThis, elementMakerFunction) => {
    return (`${mapThis.map(x => elementMakerFunction(state, x)).join('')}`)
}

const roverCardMakerFunction = (state, rover) => {
    return (`<button class="rover-card" onclick="onClick('${rover}')"> <h2 class="card-title"> ${rover} </h2> </button>`)
}

roverNames = store.rovers

roverNames.forEach((roverName) => {
    fetch(`http://localhost:3000/rovers/${roverName}/photos`)
        .then(res => res.json())
        .then(data =>
            updateStore(roverName, data.image.latest_photos[0]))
})