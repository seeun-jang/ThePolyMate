import { useState } from "react";
import {
  Sparkles,
  Plus,
  Check,
  Smile,
  Coffee,
  Moon,
  Send,
  Bookmark,
  MapPin,
  CalendarDays,
} from "lucide-react";
import {
  FeatureIcon,
  Mascot,
  ProgressRing,
  EmptyState,
} from "../components/UI.jsx";
import { orderedSchedules, progress, today } from "../lib/model.js";

function FeatureCard({ title, subtitle, type, href, onClick, children, foot }) {
  const content = (
    <>
      <div className="feature-card-top">
        <FeatureIcon name={type} />
        <span className="card-open" aria-hidden="true">
          <Plus size={17} />
        </span>
      </div>
      <h3>{title}</h3>
      <p className="card-subtitle">{subtitle}</p>
      <div className="card-preview">{children}</div>
      <div className="card-foot">
        {foot}
        <span aria-hidden="true">· · ·</span>
      </div>
    </>
  );
  return href ? (
    <a className={`feature-card feature-${type}`} href={href}>
      {content}
    </a>
  ) : (
    <button className={`feature-card feature-${type}`} onClick={onClick}>
      {content}
    </button>
  );
}
export default function DashboardPage({ data, update, notify, openModal }) {
  const [text, setText] = useState(""),
    [mood, setMood] = useState("calm");
  const p = progress(data.tasks),
    todays = data.schedules.filter((s) => s.date === today()),
    upcoming = orderedSchedules(data.schedules)
      .filter((s) => !s.done)
      .slice(0, 2);
  const habits = data.health.date === today() ? data.health.checked.length : 0;
  function save(event) {
    event.preventDefault();
    if (!text.trim()) {
      notify("오늘의 한 줄을 먼저 입력해주세요.");
      return;
    }
    if (data.diary.length >= 20) {
      notify(
        "기록은 20개까지 보관해요. 나의 기록에서 이전 기록을 정리해주세요.",
      );
      return;
    }
    update((d) => ({
      ...d,
      diary: [
        {
          id: crypto.randomUUID(),
          text: text.trim(),
          mood,
          createdAt: new Date().toISOString(),
        },
        ...d.diary,
      ],
    }));
    setText("");
    notify("오늘의 마음을 소중히 저장했어요.");
  }
  return (
    <div className="dashboard-page page-enter">
      <div className="page-heading">
        <div>
          <p className="eyebrow">A LITTLE BETTER, TOGETHER</p>
          <h1>
            {data.name || "게스트"}님, 오늘도 반가워요{" "}
            <span className="greeting-spark">✦</span>
          </h1>
          <p className="muted">
            서두르지 않아도 괜찮아요. 나만의 속도로 하루를 채워봐요.
          </p>
        </div>
        <a
          className="button button-outline button-small desktop-action"
          href="#/themes"
        >
          <Sparkles size={16} />
          나만의 테마
        </a>
      </div>
      <section className="daily-hero" aria-labelledby="daily-title">
        <div className="hero-writing">
          <span className="pill hero-pill">
            <Sparkles size={14} /> TODAY, WITH POLY
          </span>
          <h2 id="daily-title">
            <span>오늘은 어떤 하루를</span> <span>보내고 있나요?</span>
          </h2>
          <p>생각도, 기분도, 작은 성취도. 한 줄이면 충분해요.</p>
          <form onSubmit={save} className="daily-form">
            <label className="sr-only" htmlFor="daily-entry">
              오늘의 한 줄 기록
            </label>
            <input
              id="daily-entry"
              maxLength={500}
              placeholder="오늘의 나에게 남기고 싶은 한마디…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              type="submit"
              className="daily-send"
              aria-label="오늘의 기록 저장"
            >
              <Send size={19} />
            </button>
          </form>
          <div className="mood-row">
            <span>지금 내 마음은</span>
            {[
              { id: "happy", label: "뿌듯해요", icon: Smile },
              { id: "calm", label: "평온해요", icon: Coffee },
              { id: "tired", label: "쉬고 싶어요", icon: Moon },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`mood-chip ${mood === id ? "selected" : ""}`}
                aria-pressed={mood === id}
                onClick={() => setMood(id)}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="hero-mascot">
          <span className="hero-bubble">
            작은 한 걸음도
            <br />
            <strong>충분히 멋져요!</strong>
          </span>
          <div className="mascot-circle" />
          <Mascot />
          <span className="mascot-spark one">✦</span>
          <span className="mascot-spark two">✧</span>
        </div>
      </section>
      <section className="summary-strip" aria-label="내 하루 요약">
        <div>
          <span className="summary-icon rose">
            <Check size={18} />
          </span>
          <span>
            학습 완료{" "}
            <strong>
              {data.tasks.filter((t) => t.done).length}
              <small> / {data.tasks.length}</small>
            </strong>
          </span>
        </div>
        <div>
          <span className="summary-icon blue">
            <CalendarDays size={18} />
          </span>
          <span>
            오늘의 일정{" "}
            <strong>
              {todays.length}
              <small>개</small>
            </strong>
          </span>
        </div>
        <div>
          <span className="summary-icon gold">
            <Bookmark size={18} />
          </span>
          <span>
            쌓인 하루{" "}
            <strong>
              {data.diary.length}
              <small>개의 기록</small>
            </strong>
          </span>
        </div>
        <p>
          작은 실천이 모여
          <br />
          <strong>나만의 하루가 됩니다.</strong>
        </p>
      </section>
      <div className="section-heading">
        <div>
          <h2>내 하루를 채우는 공간</h2>
          <p>필요한 순간에, 필요한 메이트를 만나보세요.</p>
        </div>
        <span className="section-label">MY DAILY COLLECTION</span>
      </div>
      <section className="feature-grid" aria-label="Poly-Mate의 여섯 가지 공간">
        <FeatureCard
          type="study"
          title="한 걸음 더, 학습"
          subtitle="계획을 세우고 작은 성취를 쌓아요"
          href="#/learning?topic=study"
          foot="학습 메이트 만나기"
        >
          <div className="study-preview">
            <ProgressRing value={p} />
            <div>
              <small>나의 학습 계획</small>
              <strong>
                {data.tasks.filter((t) => t.done).length}개 완료했어요
              </strong>
              <span>오늘도 조금씩 자라는 중</span>
            </div>
          </div>
        </FeatureCard>
        <FeatureCard
          type="schedule"
          title="차근차근, 일정"
          subtitle="머릿속 할 일을 가볍게 정리해요"
          onClick={() => openModal("schedule")}
          foot="일정 관리하기"
        >
          {upcoming.length ? (
            <div className="mini-timeline">
              {upcoming.map((item) => (
                <div key={item.id}>
                  <span>{item.time}</span>
                  <i />
                  <strong>{item.text}</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="mini-empty">
              <CalendarDays size={30} />
              <span>오늘의 작은 약속을 추가해봐요</span>
            </div>
          )}
        </FeatureCard>
        <FeatureCard
          type="health"
          title="나를 돌보는, 건강"
          subtitle="바쁜 하루에도 나를 잊지 않도록"
          href="#/learning?topic=health"
          foot="건강 메이트 만나기"
        >
          <div className="health-preview">
            <div className="habit-bars">
              {["물 마시기", "가벼운 움직임", "잠깐의 휴식"].map((label, i) => (
                <div key={label}>
                  <span>{label}</span>
                  <div>
                    <i
                      style={{
                        width:
                          data.health.date === today() &&
                          data.health.checked.includes(
                            ["water", "walk", "rest"][i],
                          )
                            ? "100%"
                            : "8%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <strong>
              {habits}
              <small>/3</small>
            </strong>
          </div>
        </FeatureCard>
        <FeatureCard
          type="ideas"
          title="문득 떠오른, 영감"
          subtitle="스쳐 가는 생각을 놓치지 마세요"
          onClick={() => openModal("ideas")}
          foot="아이디어 보관함 열기"
        >
          <div className="inspiration-preview">
            <span className="sticky sticky-one">
              WHAT IF?
              <br />
              <strong>
                {data.ideas[0]?.text.slice(0, 25) || "작은 생각에서\n시작해요."}
              </strong>
            </span>
            <span className="sticky sticky-two">
              <Sparkles size={20} />
              새로운
              <br />
              가능성
            </span>
          </div>
        </FeatureCard>
        <FeatureCard
          type="trips"
          title="설레는 다음, 여행"
          subtitle="가고 싶은 곳, 하고 싶은 일을 모아요"
          onClick={() => openModal("trips")}
          foot="여행 위시리스트 열기"
        >
          <div className="travel-preview">
            <div className="travel-sun" />
            <div className="mountain mountain-back" />
            <div className="mountain mountain-front" />
            <div className="travel-caption">
              <MapPin size={15} />
              <span>
                {data.trips[0]?.text.slice(0, 22) || "다음 추억은 어디에서?"}
              </span>
            </div>
          </div>
        </FeatureCard>
        <FeatureCard
          type="diary"
          title="차곡차곡, 다이어리"
          subtitle="오늘의 마음을 내일의 나에게"
          onClick={() => openModal("diary")}
          foot="나의 기록 펼쳐보기"
        >
          <div className="diary-preview">
            <span className="diary-quote">“</span>
            <p>
              {data.diary[0]?.text ||
                "평범한 하루에도\n기억하고 싶은 순간이 있어요."}
            </p>
            <small>
              {data.diary[0]
                ? new Intl.DateTimeFormat("ko-KR", {
                    month: "long",
                    day: "numeric",
                  }).format(new Date(data.diary[0].createdAt))
                : "첫 번째 이야기를 기다려요"}
            </small>
          </div>
        </FeatureCard>
      </section>
      <div className="bottom-note">
        <Sparkles size={15} />
        <span>오늘의 나를 챙긴 당신, 이미 충분히 잘하고 있어요.</span>
      </div>
    </div>
  );
}
