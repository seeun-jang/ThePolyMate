import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Heart,
  Sparkles,
  Send,
  Plus,
  Trash2,
  Droplets,
  Footprints,
  Coffee,
  RotateCcw,
  MessageCircle,
  Check,
} from "lucide-react";
import {
  CheckButton,
  FeatureIcon,
  Mascot,
  ProgressRing,
} from "../components/UI.jsx";
import { getReply, progress, today, uid } from "../lib/model.js";

const suggestions = {
  study: [
    "C# 예외처리 복습하기",
    "DB 스키마와 인스턴스 차이",
    "React 상태 관리 알아보기",
  ],
  health: [
    "식사를 돌아보고 싶어요",
    "가벼운 운동을 하고 싶어요",
    "잠깐 쉬어가고 싶어요",
  ],
};
const habits = [
  {
    id: "water",
    title: "물 한 잔의 여유",
    text: "잠깐 멈추고 수분 챙기기",
    icon: Droplets,
  },
  {
    id: "walk",
    title: "몸을 가볍게 움직이기",
    text: "내 컨디션에 맞게 조금씩",
    icon: Footprints,
  },
  {
    id: "rest",
    title: "나를 위한 쉬는 시간",
    text: "화면을 내려놓고 잠깐 쉬기",
    icon: Coffee,
  },
];

function StudyPlan({ tasks, update, notify }) {
  const [input, setInput] = useState("");
  function add(event) {
    event.preventDefault();
    if (!input.trim()) return;
    if (tasks.length >= 20) {
      notify("학습 계획은 20개까지 만들 수 있어요.");
      return;
    }
    update((d) => ({
      ...d,
      tasks: [...d.tasks, { id: uid(), text: input.trim(), done: false }],
    }));
    setInput("");
  }
  return (
    <section className="learning-widget">
      <div className="widget-heading">
        <FeatureIcon name="study" />
        <h2>나의 학습 계획</h2>
      </div>
      <div className="plan-progress">
        <ProgressRing value={progress(tasks)} size={108} />
        <div>
          <strong>
            {tasks.filter((t) => t.done).length} / {tasks.length}개 완료
          </strong>
          <p>
            완료한 계획을 체크하면
            <br />
            성취도가 함께 자라요.
          </p>
        </div>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? "done" : ""}>
            <CheckButton
              checked={task.done}
              label={`${task.text} ${task.done ? "미완료로" : "완료로"} 변경`}
              onClick={() =>
                update((d) => ({
                  ...d,
                  tasks: d.tasks.map((t) =>
                    t.id === task.id ? { ...t, done: !t.done } : t,
                  ),
                }))
              }
            />
            <span>{task.text}</span>
            <button
              className="icon-button subtle"
              aria-label={`${task.text} 삭제`}
              onClick={() =>
                update((d) => ({
                  ...d,
                  tasks: d.tasks.filter((t) => t.id !== task.id),
                }))
              }
            >
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && (
        <p className="muted">첫 번째 학습 계획을 만들어보세요.</p>
      )}
      <form className="inline-add" onSubmit={add}>
        <label className="sr-only" htmlFor="new-task">
          새 학습 계획
        </label>
        <input
          id="new-task"
          value={input}
          maxLength={100}
          onChange={(e) => setInput(e.target.value)}
          placeholder="작은 학습 목표 추가"
        />
        <button
          className="icon-button"
          type="submit"
          aria-label="학습 계획 추가"
        >
          <Plus size={19} />
        </button>
      </form>
      <p className="widget-hint">
        기본 계획은 자유롭게 바꾸거나 삭제할 수 있어요.
      </p>
    </section>
  );
}
function HealthPlan({ data, update }) {
  const checked = data.health.date === today() ? data.health.checked : [];
  function toggle(id) {
    update((d) => {
      const current = d.health.date === today() ? d.health.checked : [];
      return {
        ...d,
        health: {
          date: today(),
          checked: current.includes(id)
            ? current.filter((v) => v !== id)
            : [...current, id],
        },
      };
    });
  }
  return (
    <section className="learning-widget">
      <div className="widget-heading">
        <FeatureIcon name="health" />
        <h2>오늘 나를 챙긴 순간</h2>
      </div>
      <div className="plan-progress health-progress">
        <ProgressRing
          value={Math.round((checked.length / 3) * 100)}
          size={108}
        />
        <div>
          <strong>{checked.length}개의 다정한 실천</strong>
          <p>
            완벽하지 않아도 좋아요.
            <br />
            작은 습관부터 시작해요.
          </p>
        </div>
      </div>
      <div className="habit-checklist">
        {habits.map(({ id, title, text, icon: Icon }) => (
          <button
            key={id}
            className={`habit-item ${checked.includes(id) ? "done" : ""}`}
            aria-pressed={checked.includes(id)}
            onClick={() => toggle(id)}
          >
            <span className="habit-icon">
              <Icon size={21} />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
            <span className="habit-check">
              {checked.includes(id) && <Check size={14} />}
            </span>
          </button>
        ))}
      </div>
      <p className="widget-hint">체크는 날짜가 바뀌면 새롭게 시작해요.</p>
    </section>
  );
}

export default function LearningPage({ topic, data, update, notify }) {
  const [input, setInput] = useState(""),
    [pending, setPending] = useState(false),
    [confirmClear, setConfirmClear] = useState(false);
  const timer = useRef(null),
    bottom = useRef(null),
    inputRef = useRef(null);
  const messages = data.chats[topic],
    isHealth = topic === "health";
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages.length, pending]);
  function send(text) {
    const value = text.trim();
    if (!value || pending) return;
    if (value.length > 500) {
      notify("질문은 500자 이내로 입력해주세요.");
      return;
    }
    update((d) => ({
      ...d,
      chats: {
        ...d.chats,
        [topic]: [
          ...d.chats[topic],
          { id: uid(), role: "user", text: value },
        ].slice(-60),
      },
    }));
    setInput("");
    setPending(true);
    setConfirmClear(false);
    timer.current = setTimeout(() => {
      update((d) => ({
        ...d,
        chats: {
          ...d.chats,
          [topic]: [
            ...d.chats[topic],
            { id: uid(), role: "bot", text: getReply(value, topic) },
          ].slice(-60),
        },
      }));
      setPending(false);
      inputRef.current?.focus();
    }, 450);
  }
  function resetChat() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearTimeout(timer.current);
    setPending(false);
    update((d) => ({ ...d, chats: { ...d.chats, [topic]: [] } }));
    setConfirmClear(false);
    notify("대화를 새로 시작해요.");
  }
  return (
    <div
      className={`learning-page page-enter ${isHealth ? "health-mode" : ""}`}
    >
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            {isHealth ? "TAKE A LITTLE CARE" : "GROW AT YOUR OWN PACE"}
          </p>
          <h1>
            {isHealth ? "나를 챙기는 시간" : "조금씩, 더 넓은 나로"}{" "}
            <span className="greeting-spark">✦</span>
          </h1>
          <p className="muted">
            {isHealth
              ? "작은 실천으로 몸과 마음의 여유를 만들어봐요."
              : "궁금한 건 함께 풀고, 오늘의 배움을 차곡차곡 쌓아요."}
          </p>
        </div>
        <div className="mode-tabs" aria-label="메이트 선택">
          <a
            className={!isHealth ? "active" : ""}
            href="#/learning?topic=study"
            aria-current={!isHealth ? "page" : undefined}
          >
            <BookOpen size={16} />
            학습
          </a>
          <a
            className={isHealth ? "active" : ""}
            href="#/learning?topic=health"
            aria-current={isHealth ? "page" : undefined}
          >
            <Heart size={16} />
            건강
          </a>
        </div>
      </div>
      <div className="learning-grid">
        <section
          className="chat-panel"
          aria-label={`${isHealth ? "건강" : "학습"} 메이트 대화`}
        >
          <div className="chat-panel-header">
            <div className="chat-identity">
              <div className="avatar">
                <Mascot />
              </div>
              <div>
                <strong>Poly, 나의 {isHealth ? "건강" : "학습"} 메이트</strong>
                <span>키워드 기반 데모 대화</span>
              </div>
            </div>
            <button
              className={`icon-button ${confirmClear ? "confirm-clear" : ""}`}
              disabled={pending || messages.length === 0}
              aria-label={
                confirmClear ? "대화 삭제 확인" : "대화 새로 시작하기"
              }
              onClick={resetChat}
            >
              {confirmClear ? <span>삭제 확인</span> : <RotateCcw size={17} />}
            </button>
          </div>
          <div
            className="chat-scroll"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            <div className="chat-date">우리의 작은 대화</div>
            <div className="chat-message bot">
              <span className="bot-mark">
                <Sparkles size={15} />
              </span>
              <div className="message-content">
                <span className="message-name">POLY</span>
                <p>
                  {isHealth
                    ? "안녕하세요! 바쁜 하루 속에서도 나를 챙기는 시간을 함께 만들어봐요. 식사, 움직임, 휴식 중 어떤 이야기를 나눌까요?"
                    : "안녕하세요! 오늘의 배움을 함께 정리해봐요. C# 예외처리, DB 개념, React 학습 중 궁금한 것을 물어보세요."}
                </p>
              </div>
            </div>
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.role}`}>
                {message.role === "bot" && (
                  <span className="bot-mark">
                    <Sparkles size={15} />
                  </span>
                )}
                <div className="message-content">
                  <span className="message-name">
                    {message.role === "bot" ? "POLY" : "나"}
                  </span>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            {pending && (
              <div
                className="typing-bubble"
                role="status"
                aria-label="Poly가 답변을 준비하고 있어요"
              >
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={bottom} />
          </div>
          <div className="chat-composer">
            <div className="suggestion-label">
              <Sparkles size={13} />
              이렇게 물어보세요
            </div>
            <div className="suggestions">
              {suggestions[topic].map((question) => (
                <button
                  disabled={pending}
                  key={question}
                  onClick={() => send(question)}
                >
                  {question}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="chat-form"
            >
              <label className="sr-only" htmlFor="chat-question">
                Poly에게 질문하기
              </label>
              <input
                id="chat-question"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.nativeEvent.isComposing)
                    e.preventDefault();
                }}
                maxLength={500}
                placeholder={
                  pending
                    ? "Poly가 답변을 준비하고 있어요…"
                    : "궁금한 것을 편하게 물어보세요"
                }
                disabled={pending}
              />
              <button
                className="daily-send"
                disabled={pending || !input.trim()}
                aria-label="질문 보내기"
                type="submit"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="chat-disclosure">
              준비된 예시 응답을 보여주는 학습용 대화입니다.{" "}
              {isHealth
                ? "개인별 건강 판단이나 의료 상담은 제공하지 않아요."
                : "실제 생성형 AI와 연결되어 있지 않아요."}{" "}
              최근 대화 60개를 보관해요.
            </p>
          </div>
        </section>
        <aside className="learning-aside">
          {isHealth ? (
            <HealthPlan data={data} update={update} />
          ) : (
            <StudyPlan tasks={data.tasks} update={update} notify={notify} />
          )}
          <section className="study-tip">
            <span>
              <MessageCircle size={20} />
            </span>
            <p className="eyebrow">
              {isHealth ? "A GENTLE REMINDER" : "POLY’S STUDY NOTE"}
            </p>
            <h3>
              {isHealth
                ? "쉬는 시간도 하루의 일부예요."
                : "한 번에 하나씩, 차근차근."}
            </h3>
            <p>
              {isHealth
                ? "오늘의 나에게 필요한 만큼만. 남과 비교하지 않고 내 몸의 리듬을 살펴봐요."
                : "헷갈리는 개념은 나만의 문장으로 적어보세요. 설명할 수 있게 되는 순간, 배움이 내 것이 됩니다."}
            </p>
            <span className="tip-flower" aria-hidden="true">
              ✳
            </span>
          </section>
        </aside>
      </div>
    </div>
  );
}
