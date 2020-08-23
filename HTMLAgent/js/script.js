(function(){
    var leftPage = document.querySelector('#leftPage');
    document.querySelector('#toggleSidebar').addEventListener('click', function(){
        leftPage.classList.toggle('show');
    });
    var e = document.querySelectorAll('.categories a');
    for (var i = 0; i < e.length; i++) {
        e[i].addEventListener('click', function(){
            leftPage.classList.remove('show');
        });
    }
})()