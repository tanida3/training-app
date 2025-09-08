"use client";
import React, { useMemo, useState, useCallback } from "react";

// ===== Types =====
// 選択モードの種類
export type SelectionMode = "single" | "multiple" | "range";

// カレンダーコンポーネントの props
export type CalendarProps = {
  /** 選択モード */
  selectionMode?: SelectionMode;
  /** single モード用 */
  value?: Date | null;
  /** multiple モード用 */
  values?: Date[];
  /** range モード用 */
  range?: { start?: Date | null; end?: Date | null };
  /** 日付選択時のコールバック */
  onChange?: (date: Date | null) => void; // single
  onChangeMultiple?: (dates: Date[]) => void; // multiple
  onChangeRange?: (range: { start?: Date | null; end?: Date | null }) => void; // range

  /** 表示する月（任意）。指定しない場合は内部 state で管理 */
  month?: Date;
  onMonthChange?: (nextMonth: Date) => void;

  /** 選択可能日制限 */
  minDate?: Date;
  maxDate?: Date;
  disabledDate?: (d: Date) => boolean;

  /** 装飾用 */
  highlightedDates?: Set<string>; // ハイライトする日付 YYYY-MM-DD
  renderDayContent?: (d: Date) => React.ReactNode; // 日付セル内のカスタム表示

  /** 曜日設定 */
  weekStartsOn?: 0 | 1; // 0: 日曜開始, 1: 月曜開始
  weekdayFormat?: (weekdayIndex: number) => string; // 曜日ラベル関数

  /** アクセシビリティ */
  ariaLabel?: string;

  className?: string; // 追加クラス
};

// ===== Helpers =====
// 数字を2桁にする（例: 3 → "03"）
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

// 日付を YYYY-MM-DD の文字列に変換（キー用）
const keyOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// 日付が同じか判定
const sameDate = (a?: Date | null, b?: Date | null) => !!a && !!b && keyOf(a) === keyOf(b);

// 月を進める／戻す
const addMonths = (d: Date, m: number) => {
  const nd = new Date(d.getFullYear(), d.getMonth() + m, 1);
  return nd;
};

// 指定月の日数
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

// 日付を min/max で制限
const clamp = (d: Date, min?: Date, max?: Date) => {
  if (min && d < stripTime(min)) return stripTime(min);
  if (max && d > stripTime(max)) return stripTime(max);
  return stripTime(d);
};

// 時間を削除した日付
const stripTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// 指定日が start と end の間か
const isBetween = (d: Date, start?: Date | null, end?: Date | null) => {
  if (!start || !end) return false;
  const t = stripTime(d).getTime();
  return t >= stripTime(start).getTime() && t <= stripTime(end).getTime();
};

// 月カレンダー用の 6x7 日付マトリクスを生成
function buildCalendarMatrix(viewMonth: Date, weekStartsOn: 0 | 1) {
  const y = viewMonth.getFullYear();
  const m = viewMonth.getMonth();
  const firstDay = new Date(y, m, 1);
  const firstWeekday = firstDay.getDay(); // 0..6 (日曜..土曜)
  const shift = (7 + firstWeekday - weekStartsOn) % 7; // 週開始に合わせてシフト
  const startDate = new Date(y, m, 1 - shift); // マトリクス最初の日付
  const matrix: Date[] = [];
  for (let i = 0; i < 42; i++) {
    matrix.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i));
  }
  return matrix;
}

// デフォルトの曜日ラベル（日本語）
const defaultWeekdayFormat = (i: number) => ["日", "月", "火", "水", "木", "金", "土"][i];

// ===== Component =====
export default function Calendar({
  selectionMode = "single",
  value = null,
  values = [],
  range = { start: null, end: null },
  onChange,
  onChangeMultiple,
  onChangeRange,
  month,
  onMonthChange,
  minDate,
  maxDate,
  disabledDate,
  highlightedDates,
  renderDayContent,
  weekStartsOn = 0,
  weekdayFormat = defaultWeekdayFormat,
  ariaLabel = "Calendar",
  className,
}: CalendarProps) {
  // 内部月 state（未指定時）
  const [innerMonth, setInnerMonth] = useState<Date>(() => new Date());
  const viewMonth = month ? stripTime(new Date(month)) : innerMonth;

  // 月変更処理
  const setMonth = useCallback(
    (next: Date) => {
      if (onMonthChange) onMonthChange(next); // 親が制御している場合
      else setInnerMonth(next); // 内部 state 更新
    },
    [onMonthChange]
  );

  // カレンダーマトリクスを生成
  const matrix = useMemo(() => buildCalendarMatrix(viewMonth, weekStartsOn), [viewMonth, weekStartsOn]);

  // 日付が無効か判定
  const isDisabled = useCallback(
    (d: Date) => {
      if (minDate && stripTime(d) < stripTime(minDate)) return true;
      if (maxDate && stripTime(d) > stripTime(maxDate)) return true;
      if (disabledDate && disabledDate(d)) return true;
      return false;
    },
    [minDate, maxDate, disabledDate]
  );

  // 日付が選択済みか判定
  const isSelected = useCallback(
    (d: Date) => {
      if (selectionMode === "single") return sameDate(d, value);
      if (selectionMode === "multiple") return values.some((vd) => sameDate(vd, d));
      if (selectionMode === "range") return sameDate(d, range.start) || sameDate(d, range.end) || isBetween(d, range.start, range.end);
      return false;
    },
    [selectionMode, value, values, range]
  );

  // 日付選択時の処理
  const onSelectDate = (d: Date) => {
    if (isDisabled(d)) return;

    if (selectionMode === "single") {
      onChange?.(d);
      return;
    }
    if (selectionMode === "multiple") {
      const exists = values.some((vd) => sameDate(vd, d));
      const next = exists ? values.filter((vd) => !sameDate(vd, d)) : [...values, d];
      onChangeMultiple?.(next.sort((a, b) => a.getTime() - b.getTime()));
      return;
    }
    if (selectionMode === "range") {
      const { start, end } = range;
      if (!start || (start && end)) {
        onChangeRange?.({ start: d, end: null }); // 範囲開始
      } else if (start && !end) {
        const s = stripTime(start);
        const e = stripTime(d);
        if (e < s) onChangeRange?.({ start: d, end: s }); // 選択逆順
        else onChangeRange?.({ start: s, end: e }); // 通常
      }
      return;
    }
  };

  // 月移動関数
  const goPrev = () => setMonth(addMonths(viewMonth, -1));
  const goNext = () => setMonth(addMonths(viewMonth, 1));
  const goToday = () => setMonth(new Date());

  // ヘッダー表示用
  const headerLabel = `${viewMonth.getFullYear()}年 ${viewMonth.getMonth() + 1}月`;

  return (
    <div className={"w-full max-w-md select-none " + (className ?? "") } aria-label={ariaLabel}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold">{headerLabel}</div>
        <div className="flex items-center gap-2">
          <button onClick={goToday} className="px-3 py-1 text-sm rounded-xl border hover:bg-gray-50">今日</button>
          <button onClick={goPrev} className="px-3 py-1 rounded-xl border hover:bg-gray-50" aria-label="前の月">‹</button>
          <button onClick={goNext} className="px-3 py-1 rounded-xl border hover:bg-gray-50" aria-label="次の月">›</button>
        </div>
      </div>

      {/* 曜日 */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500">
        {Array.from({ length: 7 }).map((_, i) => {
          const idx = ((i + weekStartsOn) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
          return (
            <div key={i} className="py-2">{weekdayFormat(idx)}</div>
          );
        })}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-1">
        {matrix.map((d, i) => {
          const inMonth = d.getMonth() === viewMonth.getMonth(); // 当月か
          const disabled = isDisabled(d); // 選択不可か
          const selected = isSelected(d); // 選択済みか
          const key = keyOf(d);
          const isToday = key === keyOf(new Date());
          const isHighlighted = highlightedDates?.has(key); // ハイライト日か

          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onSelectDate(d)}
              className={[
                "relative h-10 rounded-2xl border text-sm flex items-center justify-center transition",
                inMonth ? "bg-white" : "bg-gray-50 text-gray-400",
                disabled ? "opacity-40 cursor-not-allowed" : "hover:shadow-sm",
                selected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200",
                isToday && !selected ? "outline outline-1 outline-blue-300" : "",
              ].join(" ")}
            >
              <span className="pointer-events-none">{d.getDate()}</span>

              {/* ハイライトドット */}
              {isHighlighted && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}

              {/* カスタム日付コンテンツ */}
              {renderDayContent && (
                <span className="absolute inset-0 flex items-end justify-center pb-1 text-[10px] text-gray-600">
                  {renderDayContent(d)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 凡例 */}
      {highlightedDates && highlightedDates.size > 0 && (
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          <span>記録あり</span>
        </div>
      )}
    </div>
  );
}

// ===== 小さなデモ用フック =====
export function useCalendarDemo() {
  const [selected, setSelected] = useState<Date | null>(new Date());
  const [range, setRange] = useState<{ start?: Date | null; end?: Date | null }>({});
  const [values, setValues] = useState<Date[]>([]);
  const [mode, setMode] = useState<SelectionMode>("single");

  const highlighted = useMemo(() => new Set<string>([
    keyOf(new Date()), // 今日
    keyOf(new Date(new Date().setDate(new Date().getDate() - 1))), // 昨日
  ]), []);

  return { selected, setSelected, range, setRange, values, setValues, mode, setMode, highlighted };
}
