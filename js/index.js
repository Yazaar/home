if (true){
    let images = ['landingBG1.jpg', 'landingBG2.jpg'];
    let currentImage = Math.floor(Math.random()*images.length);

    for (i of document.querySelectorAll('section#landing div#medias a i')){
        i.style.transition = 'transform 100ms linear, color 200ms linear'
    }

    let swapBackground = function(name){
        document.querySelector('div#landingBGBlender').style.opacity = '1';
        setTimeout(function(){
            document.querySelector('section#landing').style.background = 'url(./img/' + name + ')';
            document.querySelector('div#landingBGBlender').style.opacity = '0';
        }, 600);
    }

    swapBackground(images[currentImage]);
    setInterval(function(){
        if (currentImage+2 > images.length){
            currentImage = 0;
        } else {
            currentImage++;
        }
        swapBackground(images[currentImage]);
    }, 10000);
}