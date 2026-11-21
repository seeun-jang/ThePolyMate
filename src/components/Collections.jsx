import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Download,
  X,
  Check,
  CalendarDays,
  NotebookPen,
  Lightbulb,
  Plane,
} from "lucide-react";
import { Modal, EmptyState, CheckButton } from "./UI.jsx";
import { addSchedule, orderedSchedules, today, uid } from "../lib/model.js";

export function ScheduleModal({ items, update, notify, onClose }) {
  const [text, setText] = useState(""),
    [date, setDate] = useState(today),
    [time, setTime] = useState("09:00"),
    [editing, setEditing] = useState(null),
    [error, setError] = useState("");
  function reset() {
    setText("");
    setEditing(null);
    setError("");
  }
  function submit(event) {
    event.preventDefault();
    if (!text.trim()) {
      setError("일정 내용을 입력해주세요.");
      return;
    }
    if (!date || !time || Number.isNaN(Date.parse(`${date}T${time}`))) {
      setError("날짜와 시간을 확인해주세요.");
      return;
    }
    if (editing) {
      update((d) => ({
        ...d,
        schedules: d.schedules.map((s) =>
          s.id === editing ? { ...s, text: text.trim(), date, time } : s,
        ),
      }));
      notify("일정을 수정했어요.");
    } else {
      const result = addSchedule(items, { text, date, time });
      if (result.error) {
        setError(result.error);
        return;
      }
      update((d) => ({ ...d, schedules: result.items }));
      notify("새로운 약속을 추가했어요.");
    }
    reset();
  }
  return (
    <Modal
      title="차근차근, 나의 일정"
      description="작은 약속부터 하나씩. 날짜와 시간순으로 정리해드려요."
      onClose={onClose}
      wide
    >
      <form className="schedule-form" onSubmit={submit}>
        <label htmlFor="schedule-text">어떤 일을 할까요?</label>
        <input
          id="schedule-text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError("");
          }}
          placeholder="예: React 컴포넌트 실습하기"
          maxLength={100}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "schedule-error" : undefined}
        />
        <div className="schedule-fields">
          <div>
            <label htmlFor="schedule-date">날짜</label>
            <input
              id="schedule-date"
              type="date"
              value={date}
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="schedule-time">시간</label>
            <input
              id="schedule-time"
              type="time"
              value={time}
              required
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <button className="button button-primary" type="submit">
            {editing ? <Check size={17} /> : <Plus size={17} />}
            {editing ? "수정 저장" : "일정 추가"}
          </button>
          {editing && (
            <button
              className="icon-button"
              type="button"
              onClick={reset}
              aria-label="일정 수정 취소"
            >
              <X size={19} />
            </button>
          )}
        </div>
        {error && (
          <p className="form-error" id="schedule-error" role="alert">
            {error}
          </p>
        )}
      </form>
      <div className="collection-heading">
        <strong>
          나의 약속 <span>{items.length}/12</span>
        </strong>
        <small>완료한 일정은 아래에 표시돼요</small>
      </div>
      {items.length ? (
        <ul className="schedule-list">
          {orderedSchedules(items).map((item) => (
            <li className={item.done ? "done" : ""} key={item.id}>
              <CheckButton
                checked={item.done}
                label={`${item.text} ${item.done ? "미완료로" : "완료로"} 변경`}
                onClick={() =>
                  update((d) => ({
                    ...d,
                    schedules: d.schedules.map((s) =>
                      s.id === item.id ? { ...s, done: !s.done } : s,
                    ),
                  }))
                }
              />
              <div className="schedule-item-copy">
                <time dateTime={`${item.date}T${item.time}`}>
                  {item.date.replaceAll("-", ".")} · {item.time}
                </time>
                <strong>{item.text}</strong>
              </div>
              <button
                className="icon-button subtle"
                aria-label={`${item.text} 수정`}
                onClick={() => {
                  setEditing(item.id);
                  setText(item.text);
                  setDate(item.date);
                  setTime(item.time);
                  setError("");
                  document.getElementById("schedule-text")?.focus();
                }}
              >
                <Pencil size={16} />
              </button>
              <button
                className="icon-button subtle"
                aria-label={`${item.text} 삭제`}
                onClick={() => {
                  update((d) => ({
                    ...d,
                    schedules: d.schedules.filter((s) => s.id !== item.id),
                  }));
                  if (editing === item.id) reset();
                }}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={CalendarDays}>
          아직 일정이 없어요.
          <br />
          오늘의 작은 약속을 하나 만들어볼까요?
        </EmptyState>
      )}
    </Modal>
  );
}

const collections = {
  diary: {
    title: "차곡차곡, 나의 기록",
    desc: "오늘의 마음을 꺼내 읽어보세요. 최근 기록을 위에 모았어요.",
    placeholder: "오늘 기억하고 싶은 순간을 적어주세요.",
    icon: NotebookPen,
    empty: "첫 번째 이야기를 기다리고 있어요.",
    add: "기록 저장",
  },
  ideas: {
    title: "문득 떠오른, 나의 영감",
    desc: "정리되지 않은 생각도 괜찮아요. 떠오르는 대로 남겨보세요.",
    placeholder: "만들고 싶은 것, 발견한 것, 문득 떠오른 생각…",
    icon: Lightbulb,
    empty: "작은 아이디어 하나로 시작해봐요.",
    add: "아이디어 저장",
  },
  trips: {
    title: "설레는 다음, 여행 위시리스트",
    desc: "가고 싶은 곳과 하고 싶은 일을 모아 나만의 여행을 그려봐요.",
    placeholder: "예: 강릉 바다 앞에서 책 한 권 읽기",
    icon: Plane,
    empty: "다음 추억을 만들고 싶은 곳은 어디인가요?",
    add: "여행 소망 저장",
  },
};
export function CollectionModal({ kind, items, update, notify, onClose }) {
  const config = collections[kind];
  const [text, setText] = useState(""),
    [editing, setEditing] = useState(null),
    [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    if (!text.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }
    if (!editing && items.length >= 20) {
      setError(
        "20개까지 보관할 수 있어요. 이전 항목을 정리한 뒤 추가해주세요.",
      );
      return;
    }
    update((d) => ({
      ...d,
      [kind]: editing
        ? d[kind].map((item) =>
            item.id === editing ? { ...item, text: text.trim() } : item,
          )
        : [
            {
              id: uid(),
              text: text.trim(),
              createdAt: new Date().toISOString(),
              ...(kind === "diary" ? { mood: "calm" } : {}),
            },
            ...d[kind],
          ],
    }));
    setText("");
    setEditing(null);
    setError("");
    notify(editing ? "내용을 수정했어요." : "소중히 저장했어요.");
  }
  function download() {
    const blob = new Blob([JSON.stringify(items, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const href = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = href;
    a.download = `polymate-${kind}-${today()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    notify("기록 파일을 내려받았어요.");
  }
  const moodText = {
    happy: "뿌듯했던 순간",
    calm: "평온했던 순간",
    tired: "쉬고 싶었던 순간",
  };
  return (
    <Modal
      title={config.title}
      description={config.desc}
      onClose={onClose}
      wide
    >
      <form className="record-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="collection-input">
          {kind === "diary"
            ? "새 기록"
            : kind === "ideas"
              ? "새 아이디어"
              : "새 여행 소망"}
        </label>
        <textarea
          id="collection-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError("");
          }}
          maxLength={500}
          rows={3}
          placeholder={config.placeholder}
          aria-invalid={Boolean(error)}
        />
        <div className="record-form-bottom">
          <span>{text.length}/500</span>
          <div>
            {editing && (
              <button
                className="button button-text button-small"
                type="button"
                onClick={() => {
                  setEditing(null);
                  setText("");
                  setError("");
                }}
              >
                수정 취소
              </button>
            )}
            <button
              className="button button-primary button-small"
              type="submit"
            >
              {editing ? "수정 저장" : config.add}
            </button>
          </div>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
      <div className="collection-heading">
        <strong>
          보관한 이야기 <span>{items.length}/20</span>
        </strong>
        <button
          className="text-button"
          disabled={!items.length}
          onClick={download}
        >
          <Download size={15} />
          내려받기
        </button>
      </div>
      {items.length ? (
        <ul className={`record-list record-${kind}`}>
          {items.map((item) => (
            <li key={item.id}>
              <div className="record-meta">
                <time dateTime={item.createdAt}>
                  {new Intl.DateTimeFormat("ko-KR", {
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(item.createdAt))}
                </time>
                {kind === "diary" && (
                  <span className="record-mood">
                    {moodText[item.mood] || moodText.calm}
                  </span>
                )}
              </div>
              <p>{item.text}</p>
              <div className="record-actions">
                <button
                  className="text-button"
                  aria-label={`${item.text.slice(0, 20)} 수정`}
                  onClick={() => {
                    setEditing(item.id);
                    setText(item.text);
                    setError("");
                    document.getElementById("collection-input")?.focus();
                  }}
                >
                  <Pencil size={14} />
                  수정
                </button>
                <button
                  className="text-button"
                  aria-label={`${item.text.slice(0, 20)} 삭제`}
                  onClick={() => {
                    update((d) => ({
                      ...d,
                      [kind]: d[kind].filter((v) => v.id !== item.id),
                    }));
                    if (editing === item.id) {
                      setEditing(null);
                      setText("");
                    }
                  }}
                >
                  <Trash2 size={14} />
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={config.icon}>{config.empty}</EmptyState>
      )}
    </Modal>
  );
}
