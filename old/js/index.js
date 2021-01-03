if (true) {

    let triggerHeaderH1 = function () {
        headerH1.style.animation = 'headericon 2s linear'
        setTimeout(function () {
            headerH1.style.animation = ''
            setTimeout(triggerHeaderH1, 1000 + Math.floor(Math.random() * 2000))
        }, 2500)
    }

    let generateMagicText = function (element) {
        // split each letter into their own span element
        let letters = element.innerText.split('')
        element.innerHTML = ''
        for (let i of letters) {
            let e = document.createElement('span')
            e.innerText = i
            element.appendChild(e)
            
            // create animation effect
            let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "]
            let result = e.innerText
            if (result.length === 0) {
                result = ' '
            }
            let loopCount = 10 + Math.floor(Math.random() * 10)
            let j = 0
            let speed = 100 + Math.floor(Math.random() * 10)
            let loop = setInterval(() => {
                j++
                if (j > loopCount) {
                    clearInterval(loop)
                    setTimeout(() => {
                        e.innerText = result
                    }, speed + 100)
                    return
                }
                e.innerText = letters[Math.floor(Math.random() * letters.length)]
            }, speed)
        }
    }

    let getLatestVideo = function(){
        let xml = new XMLHttpRequest()
        xml.onreadystatechange = function() {
            if (xml.readyState === 4){
                if(xml.status === 200){
                    document.querySelector('#YouTubeIframe').src = 'https://www.youtube.com/embed/' + JSON.parse(xml.response).items[0].id.videoId
                } else {
                    console.log('Unable to reach the YouTube API successfully')
                }
            }
        }
        xml.open('get', 'https://www.googleapis.com/youtube/v3/search?part=snippet%2Cid&channelId=UCaJnr3RRxwrYkMbdJ0NPFFw&maxResults=1&order=date&type=video&videoEmbeddable=true&key=AIzaSyAeRjFfM1R2opdGUmaN7dtn7UTtS7hOEJM')
        xml.send()
    }

    let getTwitchUserId = function(login){
        let xml = new XMLHttpRequest()
        xml.onreadystatechange = function() {
            if (xml.readyState === 4){
                console.log(xml.status)
                console.log(JSON.parse(xml.response))
            }
        }
        xml.open('get', 'https://api.twitch.tv/helix/users?login=' + login)
        xml.setRequestHeader('Client-Id', 'br4977lmviz3ijg5fum01ie38p49im')
        xml.send()
    }

    let doCORSRequest = function(options, printResult) {
        let cors_api_url = 'https://cors-anywhere.herokuapp.com/'
        let x = new XMLHttpRequest()
        x.open(options.method, cors_api_url + options.url)
        x.onload = x.onerror = function() {
            printResult(x.responseText || '')
        }
        if (/^POST/i.test(options.method)) {
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        }
        x.send(options.data)
    }

    let getTwitchHost = function(){
        doCORSRequest({
            method: 'GET',
            url: 'https://tmi.twitch.tv/hosts?include_logins=1&host=64242999',
            data: ''
        }, function(responseData){
            if (responseData === ''){
                return
            }
            let data = JSON.parse(responseData).hosts[0]
            if (data.target_login !== undefined){
                document.getElementById('twitch-video').src = 'https://player.twitch.tv/?channel=' + data.target_login + '&autoplay=false&parent=yazaar.github.io'
                document.getElementById('twitch-chat').src = 'https://www.twitch.tv/embed/' + data.target_login + '/chat?darkpopout&parent=yazaar.github.io'
            }
        });
    }

    let resizeEvent = function(){
        let YTFrame = document.querySelector('#YouTubeIframe')
        let YTWidth = YTFrame.offsetWidth
        if(YTWidth === 0){
            return
        }
        YTFrame.style.height = YTWidth*0.5625 + 'px'
    }
    window.addEventListener('resize', resizeEvent)

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > (window.innerHeight * 0.4) && showingHeader === true && lastScrollPos < window.pageYOffset) {
            showingHeader = false
            document.querySelector('header').style.transform = 'translate(0,calc(-100% - 3rem))'
        } else if (lastScrollPos > window.pageYOffset && showingHeader === false) {
            showingHeader = true
            document.querySelector('header').style.transform = 'translate(0,0)'
        }
        lastScrollPos = window.pageYOffset
    })

    let temp = document.querySelectorAll('div#socials-content aside:nth-child(1) i')
    temp.forEach(function(node){
        node.addEventListener('mouseover', function(e){
            let nodes = document.querySelectorAll('div#socials-content aside:nth-child(1) i')
            nodes.forEach(function(n){
                if(n === e.currentTarget){
                    document.querySelector('#social-' + n.classList[1].split('-')[1]).style.display = 'flex'
                    n.classList.add('active')
                    if(n.classList[1].split('-')[1] === 'youtube'){
                        resizeEvent()
                    }
                } else {
                    document.querySelector('#social-' + n.classList[1].split('-')[1]).style.display = 'none'
                    n.classList.remove('active')
                }
            })
        })
    })

    let showingHeader = true
    let lastScrollPos = 0
    let headerH1 = document.querySelector('header a#HeaderTitle')
    
    triggerHeaderH1()
    temp = document.querySelectorAll('.letter-animation')
    temp.forEach(function(node) {
        generateMagicText(node)
    })
    temp = undefined
    getLatestVideo()
    getTwitchHost()
}