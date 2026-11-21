(function () {
    function showMessage(message, isError) {
        var messageNode = document.getElementById("loginMsg");
        if (!messageNode) {
            return;
        }

        messageNode.textContent = message;
        messageNode.classList.toggle("error", Boolean(isError));
    }

    function submitLogin() {
        var idInput = document.getElementById("userId");
        var passwordInput = document.getElementById("userPassword");

        if (!idInput || !passwordInput) {
            return;
        }

        var userId = idInput.value.trim();
        var password = passwordInput.value.trim();

        if (!userId || !password) {
            showMessage("아이디와 비밀번호를 모두 입력해줘.", true);
            return;
        }

        localStorage.setItem("polyUserName", userId);
        showMessage("로그인 성공! 메인으로 이동할게.", false);

        setTimeout(function () {
            window.location.href = "main.html";
        }, 500);
    }

    document.addEventListener("DOMContentLoaded", function () {
        var loginButton = document.getElementById("loginBtn");
        var socialButtons = document.querySelectorAll(".social-btn");
        var inputs = document.querySelectorAll("#userId, #userPassword");

        if (loginButton) {
            loginButton.addEventListener("click", submitLogin);
        }

        inputs.forEach(function (input) {
            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    submitLogin();
                }
            });
        });

        socialButtons.forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                showMessage("현재 소셜 로그인은 시연용으로 비활성화되어 있습니다. 아래 아이디와 비밀번호를 입력한 뒤 접속하기 버튼을 누르면 메인 화면으로 이동합니다.", false);
            });
        });
    });
})();
