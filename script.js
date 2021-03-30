let currentPage = 1;
let loadingImages = false;

document.querySelector('button').addEventListener('click', async () => {
   
    //clear
    

    // hämta bilder 
    let images = await getImages();

    console.log('images: ', images);
    //uppdatera vårt UI
    updateUI(images);
});


async function getImages() {
    const baseUrl = 'https://www.flickr.com/services/rest/';
    const apiKey = '076b2338e575240ec735cee082c0b5b5';
    let text = document.querySelector('#text').value;
    let method = 'flickr.photos.search';

    let url = `${baseUrl}?method=${method}&api_key=${apiKey}&text=${text}&page=${currentPage}&format=json&nojsoncallback=1`

    try {
        let resp = await fetch(url);
        let data = await resp.json();

        return data;
    }
    catch(error) {
        console.log(error);
    }
}

function updateUI(data) {

    let main = document.querySelector('main');

    data.photos.photo.forEach(img => {
        let el = document.createElement('img');
        el.setAttribute('src', imgUrl(img, 'thumb'));
        el.setAttribute('alt', img.title );

        el.addEventListener('click', () => {
            openLightbox(img.title, imgUrl(img, 'large'))
        })

        main.appendChild(el);
    });

}

function openLightbox(title, url) {
    
    let el = document.querySelector('#overlay img');
    el.setAttribute('src', url);
    el.setAttribute('alt', title);

    document.querySelector('#overlay figcaption').innerHTML = title;

    document.querySelector('#overlay').classList.toggle('show');

}

//close lightbox
document.querySelector('#overlay').addEventListener('click', () => {
    document.querySelector('#overlay').classList.toggle('show');

});

function imgUrl(img, size) {
    let sizeSuffix = 'z';
    if(size == 'thumb') { sizeSuffix = 'q'}
    if(size == 'large') { sizeSuffix = 'b'}

    let url = `https://live.staticflickr.com/${img.server}/${img.id}_${img.secret}_${sizeSuffix}.jpg`

    return url;
}


window.onscroll = function() {
    let doc = document.documentElement;
    let offset = doc.scrollTop + window.outerHeight;
    let height = doc.offsetHeight;

    if (offset >= height) {
        console.log('At bottom');

        if(!loadingImages) {
            nextPage();
        }
    }
}

async function nextPage() {
    loadingImages = true;
    currentPage++;
    let images = await getImages();

    updateUI(images);
    loadingImages = false;
} 
