import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, X, AlertCircle } from "lucide-react";
import { readData, saveData, defaultData, today } from "./lib/model.js";
import { navigate, useRoute } from "./lib/hooks.js";
import Layout from "./components/Layout.jsx";
import { ScheduleModal, CollectionModal } from "./components/Collections.jsx";
import StartPage from "./pages/StartPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LearningPage from "./pages/LearningPage.jsx";
import ThemePage from "./pages/ThemePage.jsx";

function initialData() {
  try {
    return readData(window.localStorage);
  } catch {
    return {
      data: defaultData(),
      warning:
        "브라우저 저장 기능을 사용할 수 없어 이번 방문 동안만 기록이 유지됩니다.",
    };
  }
}
const titles = {
  "/": "시작",
  "/login": "내 공간에 들어가기",
  "/dashboard": "내 대시보드",
  "/learning": "나의 메이트",
  "/themes": "나만의 테마",
};

export default function App() {
  const [initial] = useState(initialData),
    [data, setData] = useState(initial.data),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(""),
    [storageError, setStorageError] = useState(initial.warning);
  const toastTimer = useRef(null),
    returnFocus = useRef(null),
    route = useRoute();
  const update = useCallback((change) => setData(change), []);
  const openModal = useCallback((kind) => {
    returnFocus.current = document.activeElement;
    setModal(kind);
  }, []);
  const closeModal = useCallback(() => {
    setModal(null);
    requestAnimationFrame(() =>
      returnFocus.current?.focus({ preventScroll: true }),
    );
  }, []);
  const notify = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3500);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    const resetDailyHabits = () =>
      setData((current) =>
        current.health.date === today()
          ? current
          : { ...current, health: { date: today(), checked: [] } },
      );
    const timer = setInterval(resetDailyHabits, 30000);
    document.addEventListener("visibilitychange", resetDailyHabits);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", resetDailyHabits);
    };
  }, []);
  useEffect(() => {
    try {
      if (!saveData(window.localStorage, data))
        setStorageError(
          "기록을 브라우저에 저장하지 못했어요. 저장 공간이나 브라우저 설정을 확인해주세요. 이번 방문 동안의 기록은 유지됩니다.",
        );
    } catch {
      setStorageError(
        "브라우저 저장 기능이 꺼져 있어 이번 방문 동안만 기록이 유지됩니다.",
      );
    }
  }, [data]);
  useEffect(() => {
    document.title = `Poly-Mate · ${titles[route.path] || "페이지를 찾을 수 없어요"}`;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        data.theme === "space"
          ? "#151724"
          : data.theme === "drive"
            ? "#f2f7f5"
            : "#f7f8fc",
      );
  }, [route.path, data.theme]);
  useEffect(() => {
    setModal(null);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [route.path, route.topic]);
  function login(name) {
    update((d) => ({ ...d, name }));
    navigate("/dashboard");
  }
  const guest = () => {
    if (!data.name) update((d) => ({ ...d, name: "게스트" }));
    navigate("/dashboard");
  };
  function changeTheme(theme) {
    update((d) => ({ ...d, theme }));
    notify("새로운 분위기를 적용했어요.");
  }
  let page;
  if (route.path === "/") page = <StartPage onGuest={guest} name={data.name} />;
  else if (route.path === "/login")
    page = (
      <LoginPage
        onLogin={login}
        onGuest={guest}
        savedName={data.name === "게스트" ? "" : data.name}
      />
    );
  else {
    let content;
    if (route.path === "/dashboard")
      content = (
        <DashboardPage
          data={data}
          update={update}
          notify={notify}
          openModal={openModal}
        />
      );
    else if (route.path === "/learning")
      content = (
        <LearningPage
          key={route.topic}
          topic={route.topic}
          data={data}
          update={update}
          notify={notify}
        />
      );
    else if (route.path === "/themes")
      content = <ThemePage theme={data.theme} onChange={changeTheme} />;
    else
      content = (
        <section className="not-found">
          <p className="eyebrow">LOST IN MY LITTLE SPACE</p>
          <h1>이 공간은 아직 없어요.</h1>
          <p className="muted">대시보드에서 다시 시작해볼까요?</p>
          <a className="button button-primary" href="#/dashboard">
            내 대시보드로 가기
          </a>
        </section>
      );
    page = (
      <Layout
        data={data}
        route={route}
        openModal={openModal}
        onLogout={() => navigate("/")}
      >
        {content}
      </Layout>
    );
  }
  return (
    <div className="polymate" data-theme={data.theme}>
      {storageError && (
        <div className="storage-warning" role="alert">
          <AlertCircle size={18} />
          <span>{storageError}</span>
          <button
            className="icon-button"
            aria-label="저장 안내 닫기"
            onClick={() => setStorageError("")}
          >
            <X size={17} />
          </button>
        </div>
      )}
      <div inert={Boolean(modal)}>{page}</div>
      {modal === "schedule" && (
        <ScheduleModal
          items={data.schedules}
          update={update}
          notify={notify}
          onClose={closeModal}
        />
      )}
      {["diary", "ideas", "trips"].includes(modal) && (
        <CollectionModal
          kind={modal}
          items={data[modal]}
          update={update}
          notify={notify}
          onClose={closeModal}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          <span>{toast}</span>
          <button aria-label="알림 닫기" onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
