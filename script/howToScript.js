let text_before = document.getElementsByClassName("tutorial-text-before");
let text_after = document.getElementsByClassName("tutorial-text");
let scroll_button = document.getElementById("scroll-up");
scrollUp();
checkScroll();

function showTutorialText(tutorialVisible) {
    if (tutorialVisible) {
        for (let i = 0; i < text_before.length; i++) {
            text_before[i].classList.add("invisible");
        }
        for (let i = 0; i < text_after.length; i++) {
            text_after[i].classList.add("visible");
        }
    } else {
        for (let i = 0; i < text_before.length; i++) {
            text_before[i].classList.remove("invisible");
        }
        for (let i = 0; i < text_after.length; i++) {
            text_after[i].classList.remove("visible");
        }
    }
}

function scrollUp() {
    window.scrollTo(0, 0);
}

function checkScroll() {
    setTimeout(function () {
        if (window.scrollY > 200) {
            scroll_button.style = 'display: block;';
        } else {
            scroll_button.style = 'display: none;'
        }
        checkScroll();
    }, 100)
}