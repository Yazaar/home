(function(){
    var allSocials = document.querySelectorAll('.socialInfo');
    var currentSocial = document.querySelector('#twitchLinkInfo');
    var blinder = document.querySelector('#socialBlinder');

    function iterateCallback(selectorName, callback) {
        var e = document.querySelectorAll(selectorName);
        for (var i = 0; i < e.length; i++) {
            callback(e[i]);
        }
    }

    function animateFadeInElement(e, force=false) {
        if (force === false) {
            var animateAfter = e.getAttribute('data-animateAfter');
            if (animateAfter !== null) {
                var afterThis = document.querySelector(animateAfter);
                if (afterThis !== null) {
                    afterThis.addEventListener('animationend', function(e2){
                        if (afterThis !== e2.target) {
                            return;
                        }
                        animateFadeInElement(e, true);
                        return;
                    });
                    e.style.opacity = 0;
                    return;
                }
            }
        }
        var animationName = e.getAttribute('data-animationName') || 'fadeIn';
        var fadeTime = 75;
        var text = e.innerText;
        e.innerHTML = '';
        e.style.opacity = '';
        e.style.transform = 'translateX(1rem)';
        e.style.animation = 'endFadeIn ' + fadeTime + 'ms ' + (fadeTime * (text.length + 2)) + 'ms ease-in-out forwards';
        for (var i = 0; i < text.length; i++) {
            var span = document.createElement('span');
            var fadeStart = fadeTime * (text.length - i);
            span.innerText = text[i];
            span.style.opacity = 0;
            span.style.animation = animationName + ' ' + fadeTime + 'ms ' + fadeStart + 'ms ease-in-out forwards';
            e.appendChild(span);
        }
    }

    function animateSimpleFadeIn(e, force=false) {
        if (force === false) {
            var animateAfter = e.getAttribute('data-animateAfter');
            if (animateAfter !== null) {
                var afterThis = document.querySelector(animateAfter);
                if (afterThis !== null) {
                    afterThis.addEventListener('animationend', function(e2){
                        if (afterThis !== e2.target) {
                            return;
                        }
                        animateSimpleFadeIn(e, true);
                        return;
                    });
                    e.style.opacity = 0;
                    return;
                }
            }
        }
        var animationName = e.getAttribute('data-animationName') || 'simpleFadeIn';
        e.style.opacity = '';
        e.style.animation = animationName + ' 250ms ease-in-out forwards';
    }

    function changeAge() {
        var date1 = new Date('2001/01/29 00:00:00 UTC').getTime();
        var date2 = new Date().getTime();
        var age = new String((date2 - date1) / 31557600000).split('.', 2);
        age = age[0] + ',' + age[1].substr(0, 5);
        var age_e = document.querySelector('#age');
        if (age_e !== null) {
            age_e.innerText = age;
        }
    }

    function registerSocials() {
        var e = document.querySelectorAll('.socialWrapper');
        for (var i = 0; i < e.length; i++) {
            processSocial(e[i], e, i)
        }
    }

    function processSocial(e, all_e) {
        var e_id = e.id;
        e.addEventListener('mouseover', function(){
            for (var i = 0; i < all_e.length; i++) {
                all_e[i].classList.remove('active');
            }
            this.classList.add('active');
            showSocial(e_id + 'Info');
        });
        return true;
    }

    function showSocial(socialId) {
        currentSocial = document.querySelector('#' + socialId);
        if (currentSocial === null) { return; }
        for (var i = 0; i < allSocials.length; i++) {
            allSocials[i].classList.remove('active');
        }
        
        currentSocial.classList.add('active');
        blinder.style.height = currentSocial.offsetHeight + 'px';
    }

    function getLatestVideo() {
        var xml = new XMLHttpRequest();
        xml.onreadystatechange = function() {
            if (xml.readyState === 4){
                if(xml.status === 200){
                    document.querySelector('#latestVideo').src = 'https://www.youtube.com/embed/' + JSON.parse(xml.response).items[0].id.videoId;
                } else {
                    console.log('Unable to reach the YouTube API successfully');
                }
            }
        }
        xml.open('get', 'https://www.googleapis.com/youtube/v3/search?part=snippet%2Cid&channelId=UCaJnr3RRxwrYkMbdJ0NPFFw&maxResults=1&order=date&type=video&videoEmbeddable=true&key=AIzaSyAeRjFfM1R2opdGUmaN7dtn7UTtS7hOEJM');
        xml.send();
    }

    function updateBlinder() {
        if (currentSocial === null) { return; }
        blinder.style.height = currentSocial.offsetHeight + 'px';
    }
    
    changeAge();
    iterateCallback('.animateFadeIn', animateFadeInElement);
    iterateCallback('.simpleFadeIn', animateSimpleFadeIn);
    iterateCallback('.rotateIn', animateSimpleFadeIn);
    registerSocials();
    getLatestVideo();
    updateBlinder();
    
    window.addEventListener('resize', updateBlinder);

})();