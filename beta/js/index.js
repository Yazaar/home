(function(){
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
        var fadeTime = 100;
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
        e.style.animation = animationName + ' 500ms ease-in-out forwards';
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

    iterateCallback('.animateFadeIn', animateFadeInElement);
    iterateCallback('.simpleFadeIn', animateSimpleFadeIn);
    iterateCallback('.rotateIn', animateSimpleFadeIn);
    changeAge();

})();