if(true){
    let showingHeader = true
    let lastScrollPos = 0
    let headerH1 = document.querySelector('header h1')

    let triggerHeaderH1 = function(){
        headerH1.style.animation = 'headericon 2s linear'
        setTimeout(function() {
            headerH1.style.animation = ''
            setTimeout(triggerHeaderH1, 1000 + Math.floor(Math.random() * 5000))
        }, 2500)
    }

    let magicLetters = function(element){
        let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "]
        let result = element.innerText
        let loopCount = 10 + Math.floor(Math.random()*20)
        let i = 0
        let speed = 100 + Math.floor(Math.random()*10)
        let loop = setInterval(() => {
            i++
            if(i > loopCount) {
                clearInterval(loop)
                setTimeout(() => {
                    element.innerText = result
                }, speed+100)
                return
            }
            element.innerText = letters[Math.floor(Math.random()*letters.length)]
        }, speed)
    }

    triggerHeaderH1()

    window.addEventListener('scroll', function(){
        if (window.pageYOffset > (window.innerHeight*0.4) && showingHeader === true && lastScrollPos < window.pageYOffset){
            showingHeader = false
            document.querySelector('header').style.transform = 'translate(0,calc(-100% - 3rem))'
        } else if(lastScrollPos > window.pageYOffset && showingHeader === false) {
            showingHeader = true
            document.querySelector('header').style.transform = 'translate(0,0)'
        }
        lastScrollPos = window.pageYOffset
    })

    let welcomeText = document.querySelectorAll('#welcome span')
    for (let i of welcomeText){
        magicLetters(i)
    }

}