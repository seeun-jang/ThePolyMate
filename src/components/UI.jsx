import { useEffect, useId, useRef } from "react";
import { X, Check, Sparkles } from "lucide-react";
import { CategoryGlyph } from "./Icons.jsx";

export const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`;
export function Mascot({ className = "" }) {
  return (
    <img
      className={`mascot ${className}`}
      src={asset("corgi.png")}
      alt="다정한 코기 메이트 Poly"
    />
  );
}
export function Brand({ light = false }) {
  return (
    <a
      className={`brand ${light ? "brand-light" : ""}`}
      href="#/"
      aria-label="Poly-Mate 시작 화면"
    >
      <span className="brand-symbol">
        <Sparkles size={23} strokeWidth={2.4} />
      </span>
      <span>
        Poly<span className="brand-dash">-</span>Mate
        <span className="brand-dot">.</span>
      </span>
    </a>
  );
}
export function FeatureIcon({ name, size = 24 }) {
  return (
    <span className={`feature-icon ${name}`}>
      <CategoryGlyph name={name} size={size} />
    </span>
  );
}
export function ProgressRing({ value, size = 86 }) {
  const radius = 36,
    circumference = 2 * Math.PI * radius;
  return (
    <div
      className="progress-ring"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`완료율 ${value}%`}
    >
      <svg viewBox="0 0 88 88" aria-hidden="true">
        <circle cx="44" cy="44" r={radius} className="ring-track" />
        <circle
          cx="44"
          cy="44"
          r={radius}
          className="ring-fill"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <strong>
        {value}
        <small>%</small>
      </strong>
    </div>
  );
}
export function Modal({ title, description, children, onClose, wide = false }) {
  const id = useId(),
    panel = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector("input, textarea, button")?.focus();
    const key = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const controls = [
        ...panel.current.querySelectorAll(
          'button, a[href], input, textarea, select, [tabindex="0"]',
        ),
      ].filter((el) => !el.disabled && el.getClientRects().length);
      const first = controls[0],
        last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-layer"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={panel}
        className={`modal-panel ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        aria-describedby={description ? `${id}-desc` : undefined}
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">MY LITTLE SPACE</p>
            <h2 id={id}>{title}</h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="창 닫기"
          >
            <X size={22} />
          </button>
        </div>
        {description && (
          <p id={`${id}-desc`} className="muted">
            {description}
          </p>
        )}
        {children}
      </section>
    </div>
  );
}
export function EmptyState({ children, icon: Icon = Sparkles }) {
  return (
    <div className="empty-state">
      <Icon size={27} strokeWidth={1.5} />
      <p>{children}</p>
    </div>
  );
}
export function CheckButton({ checked, onClick, label }) {
  return (
    <button
      className={`check-button ${checked ? "checked" : ""}`}
      type="button"
      aria-label={label}
      aria-pressed={checked}
      onClick={onClick}
    >
      {checked && <Check size={14} strokeWidth={3} />}
    </button>
  );
}
export function Credits() {
  return (
    <footer className="credits">
      <span>작은 성장을 함께, Poly-Mate.</span>
      <details>
        <summary>디자인 리소스 출처</summary>
        <p>
          코기 및 기존 아이콘:{" "}
          <a
            href="https://www.flaticon.com/authors/freepik"
            target="_blank"
            rel="noreferrer"
          >
            Freepik
          </a>{" "}
          · 테마 아이콘: Lizel Arina · Isometric: vectorsmarket15 / Flaticon. 선
          아이콘:{" "}
          <a href="https://lucide.dev" target="_blank" rel="noreferrer">
            Lucide
          </a>{" "}
          (ISC). 원본:{" "}
          <a
            href="https://github.com/seeun-jang/ThePolyMate"
            target="_blank"
            rel="noreferrer"
          >
            ThePolyMate
          </a>
          .
        </p>
      </details>
    </footer>
  );
}
