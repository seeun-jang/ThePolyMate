import { Check, Sun, Compass, MoonStar, Sparkles } from "lucide-react";
import { Mascot } from "../components/UI.jsx";

const themes = [
  {
    id: "home",
    label: "포근한 집",
    en: "COZY HOME",
    text: "부드러운 로즈와 라벤더. 마음이 편안해지는 나만의 작은 공간.",
    icon: Sun,
    colors: ["#e97992", "#b3a1e2", "#f1d192", "#9ebfae"],
  },
  {
    id: "drive",
    label: "기분 좋은 여행",
    en: "FRESH JOURNEY",
    text: "맑은 하늘과 초록빛 풍경. 새로운 하루를 시작하는 산뜻함.",
    icon: Compass,
    colors: ["#39847d", "#a7c9be", "#eac780", "#93b8cc"],
  },
  {
    id: "space",
    label: "고요한 우주",
    en: "MIDNIGHT SPACE",
    text: "깊은 밤과 은은한 별빛. 차분하게 나에게 집중하고 싶은 순간.",
    icon: MoonStar,
    colors: ["#b9a4ff", "#8eb8df", "#dfb8ce", "#80bcb7"],
  },
];
export default function ThemePage({ theme, onChange }) {
  return (
    <div className="theme-page page-enter">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MAKE YOURSELF AT HOME</p>
          <h1>
            오늘의 기분을 담은 공간 <span className="greeting-spark">✦</span>
          </h1>
          <p className="muted">
            나를 닮은 색으로 바꿔보세요. 모든 페이지에 함께 적용돼요.
          </p>
        </div>
      </div>
      <div className="theme-intro">
        <span className="theme-intro-symbol">
          <Sparkles size={22} />
        </span>
        <p>
          <strong>같은 하루도, 다른 분위기로.</strong>
          <span>선택한 테마는 이 브라우저에 자동으로 저장됩니다.</span>
        </p>
        <span className="theme-auto-save">
          <Check size={15} />
          자동 저장
        </span>
      </div>
      <section className="theme-grid" aria-label="테마 선택">
        {themes.map(({ id, label, en, text, icon: Icon, colors }) => (
          <button
            className={`theme-choice ${theme === id ? "selected" : ""}`}
            key={id}
            aria-pressed={theme === id}
            onClick={() => onChange(id)}
          >
            <div className={`theme-preview preview-${id}`}>
              <div className="preview-scenery">
                <span />
                <i />
                <b />
              </div>
              <div className="preview-window">
                <div className="preview-sidebar">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="preview-body">
                  <div className="preview-title">
                    <Mascot />
                    <i />
                    <span />
                  </div>
                  <div className="preview-prompt" />
                  <div className="preview-card-grid">
                    {[...colors, ...colors.slice(0, 2)].map((color, i) => (
                      <div key={i} style={{ background: color }}>
                        <span />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <span className="theme-selection-mark">
                {theme === id ? <Check size={16} /> : <span />}
              </span>
            </div>
            <div className="theme-description">
              <span className="theme-en">
                <Icon size={15} />
                {en}
              </span>
              <h2>{label}</h2>
              <p>{text}</p>
              <div className="theme-bottom">
                <span className="color-swatches">
                  {colors.map((color) => (
                    <i key={color} style={{ background: color }} />
                  ))}
                </span>
                <span
                  className={theme === id ? "selected-label" : "choose-label"}
                >
                  {theme === id ? "사용 중" : "이 테마 선택"}
                </span>
              </div>
            </div>
          </button>
        ))}
      </section>
      <div className="theme-status" role="status">
        <Check size={17} />
        <span>
          현재 테마:{" "}
          <strong>{themes.find((t) => t.id === theme)?.label}</strong> · 선택
          사항을 적용했어요.
        </span>
      </div>
      <section className="theme-bottom-banner">
        <div>
          <p className="eyebrow">YOUR SPACE, YOUR PACE</p>
          <h2>
            가장 편안한 곳에서,
            <br />
            가장 나다운 하루를.
          </h2>
          <a href="#/dashboard" className="button button-primary button-small">
            내 대시보드로 돌아가기
          </a>
        </div>
        <div className="theme-banner-mascot">
          <Mascot />
          <span>
            어떤 모습이든,
            <br />
            Poly는 늘 여기 있어요.
          </span>
        </div>
      </section>
    </div>
  );
}
