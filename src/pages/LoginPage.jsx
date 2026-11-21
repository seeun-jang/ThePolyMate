import { useState } from "react";
import { Eye, EyeOff, Sparkles, UserRound, LockKeyhole } from "lucide-react";
import { Brand, Mascot } from "../components/UI.jsx";

export default function LoginPage({ onLogin, onGuest, savedName }) {
  const [name, setName] = useState(savedName || ""),
    [password, setPassword] = useState(""),
    [show, setShow] = useState(false),
    [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    if (!name.trim() || !password.trim()) {
      setError("이름과 시연용 비밀번호를 모두 입력해주세요.");
      return;
    }
    onLogin(name.trim());
  }
  return (
    <div className="login-page">
      <header className="welcome-header">
        <Brand />
        <a className="text-link" href="#/">
          시작 화면
        </a>
      </header>
      <main className="login-card">
        <section className="login-art">
          <p className="eyebrow">YOUR EVERYDAY COMPANION</p>
          <h1>
            반가워요.
            <br />
            오늘도 함께해요.
          </h1>
          <div className="login-mascot">
            <div className="scene-halo" />
            <Mascot />
            <span className="scene-spark">✦</span>
          </div>
          <p>
            완벽한 하루보다,
            <br />
            나를 챙기는 작은 순간을 모아요.
          </p>
          <div className="login-art-dots">
            <span />
            <span />
            <span />
          </div>
        </section>
        <section className="login-form-area">
          <span className="pill">
            <Sparkles size={14} /> MY LITTLE SPACE
          </span>
          <h2>나의 공간에 들어가기</h2>
          <p className="muted">Poly가 어떤 이름으로 불러주면 좋을까요?</p>
          <form onSubmit={submit} noValidate>
            <label htmlFor="user-name">이름 또는 닉네임</label>
            <div className="field-with-icon">
              <UserRound size={18} />
              <input
                autoComplete="nickname"
                id="user-name"
                maxLength={20}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="예: 세은"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>
            <label htmlFor="demo-password">시연용 비밀번호</label>
            <div className="field-with-icon">
              <LockKeyhole size={18} />
              <input
                id="demo-password"
                type={show ? "text" : "password"}
                autoComplete="off"
                maxLength={100}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="임의의 값을 입력해주세요"
                aria-invalid={Boolean(error)}
                aria-describedby="demo-login-help"
              />
              <button
                className="icon-button"
                type="button"
                aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p id="login-error" className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button button-primary full-width" type="submit">
              내 하루 시작하기
            </button>
          </form>
          <div className="login-divider">
            <span>또는</span>
          </div>
          <button
            className="button button-outline full-width"
            onClick={onGuest}
          >
            게스트로 둘러보기
          </button>
          <p className="demo-help" id="demo-login-help">
            수업 과제용 로그인 시연입니다. 비밀번호는 저장하거나 전송하지
            않으며, 실제 계정 인증은 제공하지 않아요. 이름과 기록은 이
            브라우저에만 저장됩니다.
          </p>
        </section>
      </main>
      <p className="login-footer">매일의 작은 성장에, 다정한 메이트 하나.</p>
    </div>
  );
}
