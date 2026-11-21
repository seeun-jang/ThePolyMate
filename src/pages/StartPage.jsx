import {
  BookOpen,
  CalendarDays,
  Heart,
  Sparkles,
  Check,
  ShieldCheck,
  Palette,
} from "lucide-react";
import { Brand, Mascot, FeatureIcon, Credits } from "../components/UI.jsx";

export default function StartPage({ onGuest, name }) {
  return (
    <div className="welcome-page">
      <header className="welcome-header">
        <Brand />
        <a href="#/login" className="button button-small button-outline">
          {name ? "다시 만나기" : "시작하기"}
        </a>
      </header>
      <main className="welcome-main">
        <section className="welcome-copy">
          <p className="pill">
            <Sparkles size={15} /> A LITTLE CARE, EVERY DAY
          </p>
          <h1>
            조금 더 나다운 하루,
            <br />
            <span>Poly-Mate</span>와 함께.
          </h1>
          <p className="welcome-description">
            배움도, 일상도, 잠깐의 쉼도.
            <br />
            흩어진 하루를 한곳에 모으고
            <br />
            나만의 속도로 자라나는 공간이에요.
          </p>
          <div className="welcome-actions">
            <a href="#/login" className="button button-primary">
              나의 메이트 만나기
            </a>
            <button onClick={onGuest} className="button button-text">
              먼저 둘러보기
            </button>
          </div>
          <div className="welcome-promise">
            <ShieldCheck size={16} />
            <span>별도 가입 없이 · 기록은 이 브라우저에 저장</span>
          </div>
        </section>
        <section
          className="welcome-scene"
          aria-label="일정, 학습, 건강을 함께 챙기는 Poly-Mate"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="scene-spark spark-one">✦</div>
          <div className="scene-spark spark-two">✧</div>
          <div className="scene-center">
            <div className="scene-halo" />
            <Mascot />
            <span className="mascot-hello">안녕, 나는 Poly!</span>
          </div>
          <div className="floating-note note-study">
            <span className="note-icon rose">
              <BookOpen size={22} />
            </span>
            <div>
              <strong>한 걸음씩 배우는 중</strong>
              <small>오늘의 나를 조금 더 넓게</small>
              <div className="mini-progress">
                <span />
              </div>
            </div>
          </div>
          <div className="floating-note note-schedule">
            <span className="note-icon blue">
              <CalendarDays size={22} />
            </span>
            <div>
              <small>오늘의 작은 약속</small>
              <strong>
                <Check size={15} /> 나를 위한 시간 챙기기
              </strong>
            </div>
          </div>
          <div className="floating-note note-health">
            <Heart size={22} />
            <span>쉬어가도 괜찮아.</span>
          </div>
          <div className="scene-label">your everyday companion</div>
        </section>
      </main>
      <section className="welcome-features" aria-label="주요 기능">
        <div>
          <FeatureIcon name="study" />
          <span>
            <strong>성장을 기록하는 학습</strong>
            <small>계획과 오답노트를 한곳에</small>
          </span>
        </div>
        <div>
          <FeatureIcon name="schedule" />
          <span>
            <strong>가볍게 정리하는 일상</strong>
            <small>일정과 마음을 차곡차곡</small>
          </span>
        </div>
        <div>
          <span className="feature-icon themes">
            <Palette size={24} />
          </span>
          <span>
            <strong>나를 닮은 세 가지 테마</strong>
            <small>오늘의 기분에 맞는 공간</small>
          </span>
        </div>
      </section>
      <Credits />
    </div>
  );
}
