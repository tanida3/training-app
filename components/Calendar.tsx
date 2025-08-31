// Calendar.tsx
// A dependency-free (no date-fns) React + TypeScript calendar component.
// - Tailwind styled
// - Month navigation
// - Selection modes: single | multiple | range
// - Disabled/min/max dates
// - Highlighted dates (e.g., days with workouts)
// - onSelect callback
//
// Usage example:
// <Calendar
//   selectionMode="single"
//   value={selected}
//   onChange={setSelected}
//   highlightedDates={new Set(["2025-08-21","2025-08-22"])}
// />


"use client";
import React, { useMemo, useState, useCallback } from "react";

// ===== Types =====
export type SelectionMode = "single" | "multiple" | "range";

export type CalendarProps = {
  /** Selection behavior */
  selectionMode?: SelectionMode;
  /** For single mode */
  value?: Date | null;
  /** For multiple mode */
  values?: Date[];
  /** For range mode */
  range?: { start?: Date | null; end?: Date | null };
  /** Change handlers */
  onChange?: (date: Date | null) => void; // single
  onChangeMultiple?: (dates: Date[]) => void; // multiple
  onChangeRange?: (range: { start?: Date | null; end?: Date | null }) => void; // range

  /** Month being displayed (optional). If omitted, internal state controls it */
  month?: Date; // any date within the month
  onMonthChange?: (nextMonth: Date) => void;

  /** Date constraints */
  minDate?: Date;
  maxDate?: Date;
  disabledDate?: (d: Date) => boolean;

  /** Decorators */
  highlightedDates?: Set<string>; // YYYY-MM-DD keys
  renderDayContent?: (d: Date) => React.ReactNode; // custom cell content (e.g., dots, badges)

  /** Locale */
  weekStartsOn?: 0 | 1; // 0: Sunday, 1: Monday
  weekdayFormat?: (weekdayIndex: number) => string; // 0..6 (Sun..Sat)

  /** Accessibility */
  ariaLabel?: string;

  className?: string;
};

// ===== Helpers =====
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const keyOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; // YYYY-MM-DD

const sameDate = (a?: Date | null, b?: Date | null) => !!a && !!b && keyOf(a) === keyOf(b);

const addMonths = (d: Date, m: number) => {
  const nd = new Date(d.getFullYear(), d.getMonth() + m, 1);
  return nd;
};

const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

const clamp = (d: Date, min?: Date, max?: Date) => {
  if (min && d < stripTime(min)) return stripTime(min);
  if (max && d > stripTime(max)) return stripTime(max);
  return stripTime(d);
};

const stripTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const isBetween = (d: Date, start?: Date | null, end?: Date | null) => {
  if (!start || !end) return false;
  const t = stripTime(d).getTime();
  return t >= stripTime(start).getTime() && t <= stripTime(end).getTime();
};

// Build a 6x7 matrix of dates for the month view
function buildCalendarMatrix(viewMonth: Date, weekStartsOn: 0 | 1) {
  const y = viewMonth.getFullYear();
  const m = viewMonth.getMonth();
  const firstDay = new Date(y, m, 1);
  const firstWeekday = firstDay.getDay(); // 0..6 (Sun..Sat)
  const shift = (7 + firstWeekday - weekStartsOn) % 7; // offset from week start

  const startDate = new Date(y, m, 1 - shift); // first cell date
  const matrix: Date[] = [];
  for (let i = 0; i < 42; i++) {
    matrix.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i));
  }
  return matrix;
}

// Default weekday labels (ja)
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
  // Internal month state if not controlled
  const [innerMonth, setInnerMonth] = useState<Date>(() => new Date());
  const viewMonth = month ? stripTime(new Date(month)) : innerMonth;

  const setMonth = useCallback(
    (next: Date) => {
      if (onMonthChange) onMonthChange(next);
      else setInnerMonth(next);
    },
    [onMonthChange]
  );

  const matrix = useMemo(() => buildCalendarMatrix(viewMonth, weekStartsOn), [viewMonth, weekStartsOn]);

  const isDisabled = useCallback(
    (d: Date) => {
      if (minDate && stripTime(d) < stripTime(minDate)) return true;
      if (maxDate && stripTime(d) > stripTime(maxDate)) return true;
      if (disabledDate && disabledDate(d)) return true;
      return false;
    },
    [minDate, maxDate, disabledDate]
  );

  const isSelected = useCallback(
    (d: Date) => {
      if (selectionMode === "single") return sameDate(d, value);
      if (selectionMode === "multiple") return values.some((vd) => sameDate(vd, d));
      if (selectionMode === "range") return sameDate(d, range.start) || sameDate(d, range.end) || isBetween(d, range.start, range.end);
      return false;
    },
    [selectionMode, value, values, range]
  );

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
        onChangeRange?.({ start: d, end: null });
      } else if (start && !end) {
        const s = stripTime(start);
        const e = stripTime(d);
        if (e < s) onChangeRange?.({ start: d, end: s });
        else onChangeRange?.({ start: s, end: e });
      }
      return;
    }
  };

  const goPrev = () => setMonth(addMonths(viewMonth, -1));
  const goNext = () => setMonth(addMonths(viewMonth, 1));
  const goToday = () => setMonth(new Date());

  // Header label
  const headerLabel = `${viewMonth.getFullYear()}年 ${viewMonth.getMonth() + 1}月`;

  return (
    <div className={"w-full max-w-md select-none " + (className ?? "") } aria-label={ariaLabel}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold">{headerLabel}</div>
        <div className="flex items-center gap-2">
          <button onClick={goToday} className="px-3 py-1 text-sm rounded-xl border hover:bg-gray-50">今日</button>
          <button onClick={goPrev} className="px-3 py-1 rounded-xl border hover:bg-gray-50" aria-label="前の月">‹</button>
          <button onClick={goNext} className="px-3 py-1 rounded-xl border hover:bg-gray-50" aria-label="次の月">›</button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500">
        {Array.from({ length: 7 }).map((_, i) => {
          const idx = ((i + weekStartsOn) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
          return (
            <div key={i} className="py-2">{weekdayFormat(idx)}</div>
          );
        })}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {matrix.map((d, i) => {
          const inMonth = d.getMonth() === viewMonth.getMonth();
          const disabled = isDisabled(d);
          const selected = isSelected(d);
          const key = keyOf(d);
          const isToday = key === keyOf(new Date());
          const isHighlighted = highlightedDates?.has(key);

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

              {/* Highlight dot */}
              {isHighlighted && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}

              {/* Custom day content slot (e.g., volume, emoji) */}
              {renderDayContent && (
                <span className="absolute inset-0 flex items-end justify-center pb-1 text-[10px] text-gray-600">
                  {renderDayContent(d)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend (optional) */}
      {highlightedDates && highlightedDates.size > 0 && (
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          <span>記録あり</span>
        </div>
      )}
    </div>
  );
}

// ===== Small demo helper (optional) =====
// You can remove this from production and control everything from parent.
export function useCalendarDemo() {
  const [selected, setSelected] = useState<Date | null>(new Date());
  const [range, setRange] = useState<{ start?: Date | null; end?: Date | null }>({});
  const [values, setValues] = useState<Date[]>([]);
  const [mode, setMode] = useState<SelectionMode>("single");

  const highlighted = useMemo(() => new Set<string>([
    keyOf(new Date()),
    keyOf(new Date(new Date().setDate(new Date().getDate() - 1))),
  ]), []);

  return { selected, setSelected, range, setRange, values, setValues, mode, setMode, highlighted };
}
