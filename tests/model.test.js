import test from "node:test";
import assert from "node:assert/strict";
import {
  STORAGE_KEY,
  defaultData,
  normalizeData,
  readData,
  saveData,
  addSchedule,
  progress,
  orderedSchedules,
  today,
  getReply,
} from "../src/lib/model.js";

const memoryStorage = (values) => ({
  getItem: (key) => values[key] ?? null,
  setItem: (key, value) => {
    values[key] = value;
  },
});

test("migrates legacy data without deleting legacy keys", () => {
  const values = {
    polyUserName: "세은",
    polyTheme: "space",
    polySchedules: JSON.stringify(["React 과제"]),
    polyDiaryEntries: JSON.stringify([
      { text: "첫 기록", createdAt: "2026-11-21T03:00:00Z" },
    ]),
  };
  const { data, warning } = readData(memoryStorage(values));
  assert.equal(warning, "");
  assert.equal(data.name, "세은");
  assert.equal(data.theme, "space");
  assert.equal(data.schedules[0].text, "React 과제");
  assert.equal(data.diary[0].text, "첫 기록");
  assert.ok(values.polySchedules);
});
test("saved data round-trips nested records and completion state", () => {
  const values = {},
    data = defaultData();
  data.tasks[0].done = true;
  data.diary.push({
    id: "diary-1",
    text: "완료했어요",
    mood: "happy",
    createdAt: new Date().toISOString(),
  });
  assert.equal(saveData(memoryStorage(values), data), true);
  const loaded = readData(memoryStorage(values)).data;
  assert.equal(progress(loaded.tasks), 33);
  assert.equal(loaded.diary[0].mood, "happy");
  assert.ok(values[STORAGE_KEY]);
});
test("corrupted JSON and unavailable storage produce usable fallbacks", () => {
  const corrupt = readData(memoryStorage({ [STORAGE_KEY]: "{broken" }));
  assert.ok(corrupt.warning);
  assert.equal(corrupt.data.tasks.length, 3);
  const denied = {
    getItem() {
      throw new Error("denied");
    },
    setItem() {
      throw new Error("quota");
    },
  };
  assert.ok(readData(denied).warning);
  assert.equal(saveData(denied, defaultData()), false);
});
test("normalizes untrusted saved shapes, invalid theme, duplicate ids and invalid records", () => {
  const data = normalizeData({
    theme: "bad",
    name: { name: "bad" },
    diary: [
      null,
      { id: "x", text: "기록", createdAt: "bad" },
      { id: "x", text: "중복" },
    ],
    schedules: [{ id: "s", text: "할 일", date: "bad", time: "99:99" }],
    chats: { study: [{ id: "c", role: "admin", text: "bad" }] },
  });
  assert.equal(data.theme, "home");
  assert.equal(data.name, "");
  assert.equal(data.diary.length, 1);
  assert.ok(!Number.isNaN(Date.parse(data.diary[0].createdAt)));
  assert.equal(data.schedules[0].time, "09:00");
  assert.equal(data.schedules[0].date, today());
  assert.deepEqual(data.chats.study, []);
});
test("health habits reset for a new day and deduplicate current habits", () => {
  assert.deepEqual(
    normalizeData({ health: { date: "2000-01-01", checked: ["water"] } }).health
      .checked,
    [],
  );
  assert.deepEqual(
    normalizeData({
      health: { date: today(), checked: ["water", "water", "invalid", "rest"] },
    }).health.checked,
    ["water", "rest"],
  );
});
test("a thirteenth schedule is rejected without silently dropping any existing schedule", () => {
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: String(i),
    text: "약속",
  }));
  assert.ok(addSchedule(items, { text: "새 일정" }).error);
  assert.equal(items.length, 12);
  assert.equal(items[0].id, "0");
  assert.ok(addSchedule([], { text: "   " }).error);
});
test("adding a schedule trims input and does not mutate the original list", () => {
  const original = [],
    result = addSchedule(original, {
      text: "  과제 복습  ",
      date: today(),
      time: "10:00",
    });
  assert.equal(original.length, 0);
  assert.equal(result.items[0].text, "과제 복습");
  assert.equal(result.items[0].done, false);
  assert.ok(result.items[0].id);
});
test("schedule ordering prioritizes incomplete tasks and then date and time", () => {
  const items = [
    { id: "late", date: "2026-12-10", time: "12:00", done: false },
    { id: "done", date: "2026-11-01", time: "09:00", done: true },
    { id: "early", date: "2026-12-10", time: "08:00", done: false },
  ];
  assert.deepEqual(
    orderedSchedules(items).map((v) => v.id),
    ["early", "late", "done"],
  );
  assert.equal(items[0].id, "late");
});
test("completion percentage derives only from actual completed tasks", () => {
  assert.equal(progress([]), 0);
  assert.equal(
    progress([{ done: true }, { done: false }, { done: false }]),
    33,
  );
  assert.equal(progress([{ done: true }]), 100);
});
test("topic responses stay separate and explicitly identify unsupported queries as demo", () => {
  assert.match(getReply("finally에 대해 알려줘", "study"), /finally/);
  assert.match(getReply("식사", "health"), /식사/);
  assert.match(getReply("모르는 내용", "study"), /데모/);
});
