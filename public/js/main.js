const titleModule = document.getElementById('titleModule');
const buttons_container = document.getElementById('buttons-container');
const view_container = document.getElementById('view-container');
const main_container = document.getElementById('main-container');
const URL_API = 'http://localhost:3000/api/curso/'  /* URL de la api */

// Realiza una solicitud 
async function FetchData(method, params) {
    const id = params ? params : ''

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify()
    };

    // Realizar la solicitud fetch
    let result = await fetch(URL_API + id, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json(); // Parsear la respuesta como JSON
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    return result
}

// Obtiene todos los módulos desde la API 
async function GetAllModules() {
    let result = await FetchData('GET');
    let CapNumber = 1;

    result.forEach((e, key) => {
        const ModuleName = e.titulo
        const ModuleBanner = e.imagen
        const ModuleID = e._id
        const ModuleNumber = key + 1
        const banner_URL = './img/hqdefault.jpg'
        const ModuleThemes = e.temas

        // Crea un botón para cada módulo y se agrega al contenedor
        let div_buttons = `
                <button onclick="GetOneModule('${ModuleID}','',1)">Módulo ${ModuleNumber}: <br>${ModuleName}</button>
            `;
        buttons_container.insertAdjacentHTML('beforeend', div_buttons)

        // Crea cards para cada tema del módulo y se agregan al contenedor principal
        ModuleThemes.forEach((e, key) => {
            let name = e.nombre;
            let firsVideo = e.urlvideos[0].url;
            let banner = firsVideo.split('=')

            let div_data = `
                <div onclick="GetOneModule('${ModuleID}', '${key}',2)" class="main-cards-card drop-shadow">
                    <img class="card-img" src="https://i.ytimg.com/vi/${banner[1]}/hqdefault.jpg" alt="image">
                    <span class="card-t itle">Cap. ${CapNumber} - ${name}</span>
                </div>
            `;

            main_container.insertAdjacentHTML('beforeend', div_data)
            CapNumber++
        });
    });
}

// Obtiene un módulo específico desde la API 
async function GetOneModule(id, CapNumber, action) {
    let result = await FetchData('GET', id);
    const ModuleThemes = result.temas
    const ModuleID = result._id
    const banner_URL = result.imagen
    titleModule.innerText = result.titulo

    main_container.innerHTML = ''
    view_container.innerHTML = ''

    // agregando los temas al DOM
    function addThemes(element, key) {
        let name = element.nombre;
        let body = element.descripcion;
        let urlvideos = element.urlvideos;
        let youtube_videos = ``

        // Obteniendo url de los videos de cada tema
        urlvideos.forEach(e => {
            let url = e.url.split('=');
            let youtube_iframe = `
                <iframe class="iframe-youtube drop-shadow" 
                    src="https://www.youtube.com/embed/${url[1]}"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                </iframe>
            `
            youtube_videos += youtube_iframe;
        });

        let view_data = `
            <h2>${name}</h2>
            <span>${body}</span>
            <section class="main-view-youtube">
                ${youtube_videos}
            </section>
        `
        view_container.insertAdjacentHTML('beforeend', view_data)
    }

    switch (action) {
        // Renderiza todos los temas del módulo en cards
        case 1:
            ModuleThemes.forEach((e, key) => {
                let ThemeName = e.nombre;
                let firsVideo = e.urlvideos[0].url;
                let banner = firsVideo.split('=')

                let div_data = `
                    <div onclick="GetOneModule('${ModuleID}', '${key}',2)" class="main-cards-card drop-shadow">
                        <img class="card-img" src="https://i.ytimg.com/vi/${banner[1]}/hqdefault.jpg" alt="image">
                        <span class="card-title">Cap. ${key + 1} - ${ThemeName}</span>
                    </div>
                `;
                main_container.insertAdjacentHTML('beforeend', div_data)
            });

            // Renderiza la opcion para ver todos los temas del modulo
            let div_viewAll = `
                <div onclick="GetOneModule('${ModuleID}', '')" class="main-cards-card drop-shadow">
                    <img class="card-img" src="${banner_URL}" alt="image" style="filter: blur(5px); " >
                    <span class="card-title"
                    style="
                        position:absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: whitesmoke; 
                        font-size: 1.2rem;
                        "
                        >Ver todo</span>
                </div>
            `;
            main_container.insertAdjacentHTML('beforeend', div_viewAll)
            break
        case 2:
            // Renderiza solo el tema especificado
            ModuleThemes.forEach((e, key) => {
                if (CapNumber == key) {
                    addThemes(e, key)
                }
            })
            break
        default:
            // Renderiza TODOS los temas
            ModuleThemes.forEach((e, key) => {
                console.log(e);

                addThemes(e, key)
            })
            break

    }
}

GetAllModules()

















function test() {
    alert('hola')
}
