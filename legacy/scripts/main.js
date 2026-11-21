(function () {
    function applySavedTheme() {
        var savedTheme = localStorage.getItem("polyTheme") || "home";
        document.body.setAttribute("data-theme", savedTheme);
    }

    function showToast(message) {
        var toast = document.getElementById("pmToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "pmToast";
            toast.className = "pm-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(function () {
            toast.classList.remove("show");
        }, 1800);
    }

    function setDynamicPlaceholder(input) {
        var userName = localStorage.getItem("polyUserName") || "user";
        var hour = new Date().getHours();
        var timeMessage = "오늘 하루는 어땠어?";

        if (hour < 12) {
            timeMessage = "좋은 아침이야! 오늘 목표를 알려줘.";
        } else if (hour >= 18) {
            timeMessage = "오늘 하루 마무리는 어땠는지 들려줘.";
        }

        input.placeholder = userName + ", " + timeMessage;
    }

    function saveDiaryEntry(text) {
        var raw = localStorage.getItem("polyDiaryEntries");
        var entries = raw ? JSON.parse(raw) : [];

        entries.unshift({
            text: text,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem("polyDiaryEntries", JSON.stringify(entries.slice(0, 20)));
    }

    function runCardEntrance() {
        var cards = document.querySelectorAll(".card");
        cards.forEach(function (card, index) {
            setTimeout(function () {
                card.classList.add("entered");
            }, 90 * index);
        });
    }

    function loadSchedules() {
        var raw = localStorage.getItem("polySchedules");
        return raw ? JSON.parse(raw) : [];
    }

    function saveSchedules(items) {
        localStorage.setItem("polySchedules", JSON.stringify(items.slice(0, 12)));
    }

    function renderSchedules() {
        var list = document.getElementById("scheduleList");
        if (!list) {
            return;
        }

        var items = loadSchedules();
        list.innerHTML = "";

        if (!items.length) {
            var empty = document.createElement("li");
            empty.className = "schedule-empty";
            empty.textContent = "아직 일정이 없어요. 오늘 계획 1개를 먼저 추가해보세요.";
            list.appendChild(empty);
            return;
        }

        items.forEach(function (item, index) {
            var li = document.createElement("li");
            li.className = "schedule-item";

            var text = document.createElement("span");
            text.textContent = item;

            var del = document.createElement("button");
            del.type = "button";
            del.textContent = "삭제";
            del.addEventListener("click", function () {
                var current = loadSchedules();
                current.splice(index, 1);
                saveSchedules(current);
                renderSchedules();
            });

            li.appendChild(text);
            li.appendChild(del);
            list.appendChild(li);
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        applySavedTheme();

        var input = document.getElementById("dailyInput");
        var sendButton = document.getElementById("dailySendBtn");
        var scheduleCard = document.getElementById("scheduleCard");
        var scheduleModal = document.getElementById("scheduleModal");
        var scheduleInput = document.getElementById("scheduleInput");
        var scheduleAddBtn = document.getElementById("scheduleAddBtn");
        var scheduleCloseBtn = document.getElementById("scheduleCloseBtn");
        var scheduleBackdrop = document.getElementById("scheduleBackdrop");

        if (!input || !sendButton) {
            return;
        }

        setDynamicPlaceholder(input);
        runCardEntrance();

        var title = document.querySelector(".dashboard-logo");
        var userName = localStorage.getItem("polyUserName") || "user";
        if (title) {
            title.textContent = "Poly-Mate, " + userName;
        }

        function openScheduleModal() {
            if (!scheduleModal) {
                return;
            }
            scheduleModal.hidden = false;
            renderSchedules();
            if (scheduleInput) {
                scheduleInput.focus();
            }
        }

        function closeScheduleModal() {
            if (!scheduleModal) {
                return;
            }
            scheduleModal.hidden = true;
        }

        function addSchedule() {
            if (!scheduleInput) {
                return;
            }

            var value = scheduleInput.value.trim();
            if (!value) {
                showToast("일정을 입력해줘.");
                return;
            }

            var items = loadSchedules();
            items.unshift(value);
            saveSchedules(items);
            scheduleInput.value = "";
            renderSchedules();
        }

        function submitEntry() {
            var value = input.value.trim();
            if (!value) {
                showToast("한 줄 기록을 먼저 입력해줘.");
                return;
            }

            saveDiaryEntry(value);
            input.value = "";
            showToast("오늘 기록을 저장했어. 정말 잘했어!");
        }

        sendButton.addEventListener("click", submitEntry);
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                submitEntry();
            }
        });

        if (scheduleCard) {
            scheduleCard.addEventListener("click", function (event) {
                event.preventDefault();
                openScheduleModal();
            });
        }

        if (scheduleAddBtn) {
            scheduleAddBtn.addEventListener("click", addSchedule);
        }

        if (scheduleInput) {
            scheduleInput.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    addSchedule();
                }
            });
        }

        if (scheduleCloseBtn) {
            scheduleCloseBtn.addEventListener("click", closeScheduleModal);
        }

        if (scheduleBackdrop) {
            scheduleBackdrop.addEventListener("click", closeScheduleModal);
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeScheduleModal();
            }
        });

        var emptyLinks = document.querySelectorAll('a[href="#"]:not(#scheduleCard)');
        emptyLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                showToast("이 기능은 다음 버전에서 열릴 예정이야.");
            });
        });
    });
})();
