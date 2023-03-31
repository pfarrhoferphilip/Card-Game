let text_before = document.getElementsByClassName("tutorial-text-before");
let text_after = document.getElementsByClassName("tutorial-text");

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