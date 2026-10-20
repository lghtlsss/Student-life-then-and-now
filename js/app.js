function showScreen(screenId){
    const screens = document.querySelectorAll(".screen");

    screens.forEach(function (screen){
        screen.hidden = true;
    });

    const selectedScreen = document.getElementById(screenId);
    selectedScreen.hidden = false;
}

