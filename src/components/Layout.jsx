import { LogOut, Sparkles } from "lucide-react";
import { Brand, Credits, Mascot } from "./UI.jsx";
import { CategoryGlyph } from "./Icons.jsx";
import { useClock } from "../lib/hooks.js";

export default function Layout({ data, route, openModal, children, onLogout }) {
  const now = useClock();
  const links = [
    {
      href: "/dashboard",
      label: "내 대시보드",
      icon: "home",
      active: route.path === "/dashboard",
    },
    {
      href: "/learning?topic=study",
      label: "학습 메이트",
      icon: "study",
      active: route.path === "/learning" && route.topic === "study",
    },
    {
      href: "/learning?topic=health",
      label: "건강 메이트",
      icon: "health",
      active: route.path === "/learning" && route.topic === "health",
    },
  ];
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        본문으로 건너뛰기
      </a>
      <aside className="sidebar">
        <Brand />
        <p className="sidebar-caption">내 하루의 다정한 메이트</p>
        <div className="nav-label">MY SPACE</div>
        <nav aria-label="주요 메뉴">
          {links.map(({ href, label, icon, active }) => (
            <a
              key={href}
              href={`#${href}`}
              className={`nav-item ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <CategoryGlyph name={icon} size={22} />
              {label}
              {active && <span className="nav-active-dot" />}
            </a>
          ))}
          <button className="nav-item" onClick={() => openModal("schedule")}>
            <CategoryGlyph name="schedule" size={22} />
            일정 관리
          </button>
          <button className="nav-item" onClick={() => openModal("diary")}>
            <CategoryGlyph name="diary" size={22} />
            나의 기록
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="tiny-sparkle">✦</span>
            <p>
              오늘의 작은 한 걸음이
              <br />
              내일의 나를 만들어요.
            </p>
          </div>
          <a
            href="#/themes"
            className={`nav-item ${route.path === "/themes" ? "active" : ""}`}
            aria-current={route.path === "/themes" ? "page" : undefined}
          >
            <CategoryGlyph name="themes" size={22} />
            나만의 테마
          </a>
          <button className="nav-item" onClick={onLogout}>
            <LogOut size={19} />
            시작 화면으로
          </button>
          <div className="sidebar-profile">
            <div className="avatar">
              <Mascot />
            </div>
            <div>
              <strong>{data.name || "게스트"}</strong>
              <small>오늘도 반가워요!</small>
            </div>
            <Sparkles size={17} />
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span className="breadcrumb">
            My space <span>/</span>{" "}
            <strong>
              {route.path === "/themes"
                ? "테마 선택"
                : route.path === "/learning"
                  ? route.topic === "health"
                    ? "건강 메이트"
                    : "학습 메이트"
                  : "대시보드"}
            </strong>
          </span>
          <div className="topbar-right">
            <time dateTime={now.toISOString()}>
              {new Intl.DateTimeFormat("ko-KR", {
                month: "long",
                day: "numeric",
                weekday: "long",
              }).format(now)}
            </time>
            <div
              className="mini-avatar"
              aria-label={`${data.name || "게스트"}의 프로필`}
            >
              <Mascot />
            </div>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Credits />
      </div>
    </div>
  );
}
