export const STORAGE_KEY = "polymate.react.v1";
export const THEMES = ["home", "drive", "space"];
export const uid = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
export const defaultData = () => ({
  name: "",
  theme: "home",
  schedules: [],
  diary: [],
  ideas: [],
  trips: [],
  tasks: [
    { id: "task-csharp", text: "C# 예외처리 개념 복습", done: false },
    { id: "task-react", text: "React 함수형 컴포넌트 실습", done: false },
    { id: "task-db", text: "DB 스키마와 인스턴스 정리", done: false },
  ],
  health: { date: today(), checked: [] },
  chats: { study: [], health: [] },
});
const cleanText = (v, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
const cleanList = (list, limit, convert) => {
  const seen = new Set();
  return (Array.isArray(list) ? list : [])
    .map(convert)
    .filter((item) => {
      if (!item || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, limit);
};
const cleanRecord = (v) =>
  v && cleanText(v.text)
    ? {
        id: cleanText(v.id, 100) || uid(),
        text: cleanText(v.text),
        createdAt: Number.isNaN(Date.parse(v.createdAt))
          ? new Date().toISOString()
          : v.createdAt,
      }
    : null;

export function normalizeData(raw) {
  const base = defaultData();
  if (!raw || typeof raw !== "object") return base;
  return {
    ...base,
    name: cleanText(raw.name, 20),
    theme: THEMES.includes(raw.theme) ? raw.theme : "home",
    schedules: cleanList(raw.schedules, 12, (v) =>
      v && cleanText(v.text, 100)
        ? {
            id: cleanText(v.id, 100) || uid(),
            text: cleanText(v.text, 100),
            done: Boolean(v.done),
            date: /^\d{4}-\d{2}-\d{2}$/.test(v.date) ? v.date : today(),
            time: /^([01]\d|2[0-3]):[0-5]\d$/.test(v.time) ? v.time : "09:00",
          }
        : null,
    ),
    diary: cleanList(raw.diary, 20, (v) => {
      const r = cleanRecord(v);
      return r
        ? {
            ...r,
            mood: ["happy", "calm", "tired"].includes(v.mood) ? v.mood : "calm",
          }
        : null;
    }),
    ideas: cleanList(raw.ideas, 20, cleanRecord),
    trips: cleanList(raw.trips, 20, cleanRecord),
    tasks: Array.isArray(raw.tasks)
      ? cleanList(raw.tasks, 20, (v) =>
          v && cleanText(v.text, 100)
            ? {
                id: cleanText(v.id, 100) || uid(),
                text: cleanText(v.text, 100),
                done: Boolean(v.done),
              }
            : null,
        )
      : base.tasks,
    health:
      raw.health?.date === today()
        ? {
            date: today(),
            checked: [
              ...new Set(
                (Array.isArray(raw.health.checked)
                  ? raw.health.checked
                  : []
                ).filter((v) => ["water", "walk", "rest"].includes(v)),
              ),
            ],
          }
        : base.health,
    chats: Object.fromEntries(
      ["study", "health"].map((topic) => [
        topic,
        cleanList(raw.chats?.[topic], 60, (v) =>
          v && ["user", "bot"].includes(v.role) && cleanText(v.text)
            ? {
                id: cleanText(v.id, 100) || uid(),
                role: v.role,
                text: cleanText(v.text),
              }
            : null,
        ),
      ]),
    ),
  };
}

export function readData(storage) {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (saved) return { data: normalizeData(JSON.parse(saved)), warning: "" };
    const old = defaultData();
    old.name = storage.getItem("polyUserName") || "";
    old.theme = storage.getItem("polyTheme") || "home";
    for (const [key, field] of [
      ["polySchedules", "schedules"],
      ["polyDiaryEntries", "diary"],
    ]) {
      try {
        const list = JSON.parse(storage.getItem(key) || "[]");
        if (Array.isArray(list))
          old[field] = list.map((v) =>
            field === "schedules"
              ? {
                  id: uid(),
                  text: typeof v === "string" ? v : v.text,
                  date: today(),
                  time: "09:00",
                  done: false,
                }
              : { ...v, id: uid(), mood: "calm" },
          );
      } catch {
        /* A damaged legacy entry does not discard the other settings. */
      }
    }
    return { data: normalizeData(old), warning: "" };
  } catch {
    return {
      data: defaultData(),
      warning:
        "저장된 데이터를 읽지 못했어요. 이번 방문에서는 새 기록으로 시작합니다.",
    };
  }
}

export function saveData(storage, data) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
export const progress = (tasks) =>
  tasks.length
    ? Math.round(
        (tasks.filter((task) => task.done).length / tasks.length) * 100,
      )
    : 0;
export const orderedSchedules = (items) =>
  [...items].sort(
    (a, b) =>
      Number(a.done) - Number(b.done) ||
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
  );
export function addSchedule(items, input) {
  if (items.length >= 12)
    return {
      error: "일정은 12개까지 저장할 수 있어요. 완료한 일정을 정리해주세요.",
    };
  const text = cleanText(input.text, 100);
  if (!text) return { error: "일정 내용을 입력해주세요." };
  return { items: [...items, { ...input, text, id: uid(), done: false }] };
}

export function getReply(message, topic) {
  const text = message.toLowerCase();
  if (topic === "health") {
    if (/식단|식사|밥/.test(text))
      return "바쁜 날에도 식사 시간을 정해두면 좋아요. 오늘 먹은 식사를 한 줄로 기록하고, 다음 식사에 더하고 싶은 재료를 생각해볼까요?";
    if (/운동|걷기|스트레칭/.test(text))
      return "오래 앉아 있었다면 잠깐 일어나 몸을 움직여보세요. 본인 컨디션에 맞는 작은 활동을 정하고, 실천한 뒤 오늘의 루틴에 체크해봐요.";
    if (/잠|수면|휴식/.test(text))
      return "오늘은 잠들기 전 잠깐 화면을 내려놓고 쉬는 시간을 만들어볼까요? 몸이 보내는 피로 신호를 살피며 무리하지 않는 게 좋아요.";
    return "식사, 가벼운 움직임, 휴식 중 오늘 챙기고 싶은 것을 골라주세요. 이 대화는 생활 습관을 돌아보기 위한 예시 응답이에요.";
  }
  if (/예외|finally|try|catch/.test(text))
    return "C#의 try에는 예외가 발생할 수 있는 코드를, catch에는 처리 코드를 작성해요. finally는 예외 발생 여부와 관계없이 보통 실행되어 자원 정리에 사용해요. 단, 프로세스가 강제 종료되는 경우 등에는 실행이 보장되지 않아요. 짧은 예제로 실행 순서를 써보세요.";
  if (/데이터베이스|스키마|인스턴스|\bdb\b/.test(text))
    return "스키마는 데이터베이스의 구조와 제약조건, 인스턴스는 특정 시점에 저장된 실제 데이터예요. 학생 테이블의 열 정의와 현재 학생 목록을 비교하면 구분하기 쉬워요.";
  if (/react|리액트|컴포넌트|상태|usestate/.test(text))
    return "함수형 컴포넌트는 화면을 반환하는 함수예요. 바뀌는 값은 useState로 관리하고, 자식에게는 props로 전달해요. 할 일 체크 → 상태 변경 → 완료율 갱신 흐름을 직접 확인해보세요.";
  if (/시험|기말|계획/.test(text))
    return "큰 목표를 오늘 끝낼 수 있는 작은 단위로 나눠보세요. 개념 복습, 문제 풀이, 오답 정리처럼 학습 계획에 추가하고, 완료한 항목을 체크해봐요.";
  return "C# 예외처리, DB 개념, React 컴포넌트, 시험 계획 중 하나를 물어보세요. 지금은 준비된 키워드에 반응하는 학습용 데모예요.";
}
