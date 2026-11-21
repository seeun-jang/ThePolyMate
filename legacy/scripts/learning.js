(function () {
    var activeTopic = "study";

    function applySavedTheme() {
        var savedTheme = localStorage.getItem("polyTheme") || "home";
        document.body.setAttribute("data-theme", savedTheme);
    }

    function appendBubble(text, type) {
        var container = document.querySelector(".chat-messages");
        if (!container) {
            return;
        }

        var bubble = document.createElement("div");
        bubble.className = "bubble " + (type === "user" ? "bubble-user" : "bubble-bot");
        bubble.textContent = text;

        container.appendChild(bubble);
        container.scrollTop = container.scrollHeight;
    }

    function getAiReply(message) {
        var lower = message.toLowerCase();

        if (activeTopic === "health") {
            if (lower.indexOf("식단") > -1 || lower.indexOf("밥") > -1 || lower.indexOf("다이어트") > -1) {
                return "좋아, 오늘은 탄수화물 50% 단백질 30% 채소 20% 비율로 한 끼를 구성해보자. 저녁에는 과식만 피하면 충분해.";
            }

            if (lower.indexOf("운동") > -1 || lower.indexOf("러닝") > -1 || lower.indexOf("근력") > -1) {
                return "학습 집중력을 위해 20분 걷기 + 10분 스트레칭 루틴을 추천해. 오래 앉아있으면 50분마다 3분씩 일어나기만 해도 좋아.";
            }

            if (lower.indexOf("잠") > -1 || lower.indexOf("수면") > -1) {
                return "수면은 공부 효율과 직결돼. 오늘은 취침 1시간 전 화면 밝기를 줄이고, 7시간 이상 자는 걸 목표로 해보자.";
            }

            return "건강 탭에서는 식단, 운동, 수면 중 하나를 골라 질문하면 더 정확하게 도와줄 수 있어.";
        }

        if (lower.indexOf("예외") > -1) {
            return "예외처리는 1) 발생 가능 구간을 try로 묶고 2) catch에서 사용자 안내 3) finally에서 자원 정리 순서로 이해하면 정확해.";
        }

        if (lower.indexOf("db") > -1 || lower.indexOf("데이터베이스") > -1) {
            return "DB에서 스키마는 구조 정의, 인스턴스는 특정 시점의 실제 데이터야. 시험에서는 둘의 차이를 예시 테이블 하나로 설명하면 점수 받기 좋아.";
        }

        if (lower.indexOf("시험") > -1 || lower.indexOf("기말") > -1) {
            return "기말 대비는 오늘 40분 복습, 20분 문제풀이, 10분 오답 정리 루틴으로 가보자.";
        }

        if (lower.indexOf("c#") > -1 || lower.indexOf("코드") > -1 || lower.indexOf("문법") > -1) {
            return "좋아, 코드 질문은 오류 메시지와 함께 물어보면 훨씬 정확해져. 현재 막힌 코드 한 줄을 그대로 적어줘.";
        }

        return "좋은 질문이야. 과목명이나 키워드를 1개만 더 적어주면 딱 맞춰서 설명할 수 있어.";
    }

    function submitQuestion() {
        var input = document.getElementById("learnInput");
        if (!input) {
            return;
        }

        var text = input.value.trim();
        if (!text) {
            return;
        }

        appendBubble(text, "user");
        input.value = "";

        setTimeout(function () {
            appendBubble(getAiReply(text), "bot");
        }, 350);
    }

    function updateProgress(delta) {
        var fill = document.querySelector(".progress-bar .fill");
        if (!fill) {
            return;
        }

        var current = parseInt(fill.style.width || "85", 10);
        if (isNaN(current)) {
            current = 85;
        }

        var next = Math.min(100, Math.max(0, current + delta));
        fill.style.width = next + "%";
        fill.textContent = next + "% 달성!";
    }

    document.addEventListener("DOMContentLoaded", function () {
        applySavedTheme();

        var params = new URLSearchParams(window.location.search);
        activeTopic = params.get("topic") || "study";

        var title = document.querySelector(".chat-header h3");
        var introBubble = document.querySelector(".chat-messages .bubble");
        var widgetTitle = document.querySelector(".custom-widget h4");
        var noteBox = document.querySelector(".note-box");
        var suggestButtons = document.querySelectorAll(".suggest-btn");

        if (activeTopic === "health") {
            if (title) {
                title.textContent = "건강 탭";
            }
            if (introBubble) {
                introBubble.textContent = "오늘 컨디션을 기준으로 식단/운동/수면 루틴을 같이 맞춰보자!";
            }
            if (widgetTitle) {
                widgetTitle.textContent = "오늘의 건강 밸런스";
            }
            if (noteBox) {
                noteBox.innerHTML = "<strong>오늘의 건강 체크포인트</strong><br><br>- 점심 단백질 포함 식단 구성하기<br>- 20분 걷기 + 10분 스트레칭 하기";
            }
            if (suggestButtons[0]) {
                suggestButtons[0].textContent = "오늘 식단 추천 보기";
            }
            if (suggestButtons[1]) {
                suggestButtons[1].textContent = "운동/수면 질문 예시";
            }
        }

        var fill = document.querySelector(".progress-bar .fill");
        if (fill && !fill.style.width) {
            fill.style.width = "85%";
        }

        var sendButton = document.getElementById("learnSendBtn");
        var input = document.getElementById("learnInput");

        if (sendButton) {
            sendButton.addEventListener("click", submitQuestion);
        }

        if (input) {
            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    submitQuestion();
                }
            });
        }

        suggestButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                var action = button.getAttribute("data-action");

                if (action === "show-notes") {
                    if (activeTopic === "health") {
                        appendBubble("오늘 식단 추천이야. 아침: 그릭요거트+바나나, 점심: 현미밥+닭가슴살 샐러드, 저녁: 두부샐러드+고구마 반 개. 물은 하루 6~8잔 챙겨줘.", "bot");
                    } else {
                        appendBubble("오늘의 오답노트 요약을 다시 보여줄게. 1) C# 타이머 로직 2) DB 스키마/인스턴스 차이", "bot");
                    }
                    updateProgress(3);
                    return;
                }

                if (action === "ask-more") {
                    if (input) {
                        input.value = activeTopic === "health"
                            ? "집중력 높이는 저녁 식단 추천해줘"
                            : "예외처리에서 finally는 언제 꼭 필요해?";
                        input.focus();
                    }
                }
            });
        });
    });
})();
