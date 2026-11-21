(function () {
    function setActiveTheme(theme) {
        var cards = document.querySelectorAll(".theme-card");
        cards.forEach(function (card) {
            card.classList.toggle("active", card.getAttribute("data-theme") === theme);
        });

        var status = document.getElementById("themeStatus");
        if (status) {
            var label = "기본";
            if (theme === "drive") {
                label = "여행";
            } else if (theme === "space") {
                label = "우주";
            }
            status.textContent = "선택된 테마: " + label + " (저장 완료)";
        }

        document.body.setAttribute("data-theme", theme);
    }

    document.addEventListener("DOMContentLoaded", function () {
        var currentTheme = localStorage.getItem("polyTheme") || "home";
        setActiveTheme(currentTheme);

        var cards = document.querySelectorAll(".theme-card");
        cards.forEach(function (card) {
            card.addEventListener("click", function (event) {
                event.preventDefault();
                var selectedTheme = card.getAttribute("data-theme") || "home";
                localStorage.setItem("polyTheme", selectedTheme);
                setActiveTheme(selectedTheme);
            });
        });
    });
})();
