"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { MARKETING_NOTICE, PRIVACY_NOTICE, type ConsentNotice } from "../_content";
import { createReservation } from "../actions";
import { useReservation } from "./reservation-context";

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};

const inputClass =
  "border-0 border-b border-taupe bg-transparent px-0.5 py-2.5 text-base text-ink outline-none";

// Visit-day buttons fill the row: 1–3 days use that many columns (2 matches the wedding-month grid), more wrap in rows of 4.
const dayColumns = (count: number) =>
  count <= 1 ? "grid-cols-1" : count === 2 ? "grid-cols-2" : count === 3 ? "grid-cols-3" : "grid-cols-4";

function Required() {
  return <span className="text-rose">*</span>;
}

function OptionGroup({
  label,
  options,
  value,
  onSelect,
  className,
}: {
  label: string;
  options: string[];
  value: string | null;
  onSelect: (v: string) => void;
  className: string;
}) {
  return (
    <div className="flex flex-col gap-3" role="radiogroup" aria-label={label}>
      <span className="text-sm text-ink/80">
        {label} <Required />
      </span>
      <div className={`grid gap-2 ${className}`}>
        {options.map((o) => {
          const on = value === o;
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onSelect(o)}
              className={`cursor-pointer rounded border py-3.5 text-[15px] font-semibold ${
                on ? "border-primary bg-primary text-white" : "border-taupe bg-white text-ink"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// A consent checkbox with a "보기" toggle that shows what the consent covers.
function ConsentRow({
  checked,
  onChange,
  notice,
  className = "",
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  notice: ConsentNotice;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label className={`flex cursor-pointer items-center gap-2.5 ${className}`}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="size-[18px] flex-none accent-primary"
          />
          {children}
        </label>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex-none cursor-pointer text-[13px] text-muted underline underline-offset-2"
        >
          {open ? "닫기" : "보기"}
        </button>
      </div>
      {open && (
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 break-keep gap-y-1.5 rounded border border-line bg-paper px-3.5 py-3 text-[13px] leading-[1.6] text-body">
          {notice.map((n) => (
            <div key={n.label} className="contents">
              <dt className="font-semibold whitespace-nowrap text-ink/80">{n.label}</dt>
              <dd className="m-0">{n.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export function RsvpForm({
  region,
  weddingMonths,
  visitDays,
}: {
  region: string;
  weddingMonths: string[];
  visitDays: string[];
}) {
  const { submitted, setSubmitted } = useReservation();
  const [pending, startTransition] = useTransition();
  const [website, setWebsite] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState("");
  // Sent with the reservation so the server can drop instant bot submissions.
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = performance.now();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let err = "";
    if (!name.trim()) err = "이름을 입력해 주세요.";
    else if (phone.replace(/\D/g, "").length < 10) err = "휴대폰 번호를 정확히 입력해 주세요.";
    else if (!month) err = "결혼 예정월을 선택해 주세요.";
    else if (!day) err = "방문 희망일을 선택해 주세요.";
    else if (!agree) err = "개인정보 수집·이용에 동의해 주세요.";
    setError(err);
    if (err) return;

    startTransition(async () => {
      const res = await createReservation({
        region,
        name,
        phone,
        weddingMonth: month!,
        visitDay: day!,
        agreePrivacy: agree,
        agreeMarketing: marketing,
        website,
        elapsedMs: Math.round(performance.now() - shownAt.current),
      });
      if (res.ok) setSubmitted(true);
      else setError(res.error);
    });
  };

  const reset = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    setMonth(null);
    setDay(null);
    setAgree(false);
    setMarketing(false);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary text-2xl text-white">✓</div>
        <div className="font-serif text-[26px]">예약이 완료되었습니다</div>
        <div className="text-[15px] leading-[1.7] text-body">
          {name}님, {day} 방문 예약이 접수되었습니다. 담당 플래너가 곧 연락드릴게요.
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-2 cursor-pointer rounded border border-taupe bg-transparent px-[22px] py-3 text-sm text-primary"
        >
          다시 예약하기
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative flex flex-col gap-7">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-ink/80">
            이름 <Required />
          </span>
          <input
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="홍길동"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-ink/80">
            휴대폰 번호 <Required />
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => {
              setPhone(formatPhone(e.target.value));
              setError("");
            }}
            placeholder="010-1234-5678"
            className={inputClass}
          />
        </label>
      </div>

      <OptionGroup
        label="결혼 예정월"
        options={weddingMonths}
        value={month}
        onSelect={(v) => {
          setMonth(v);
          setError("");
        }}
        className="grid-cols-2 [&>button]:px-2"
      />
      <OptionGroup
        label="방문 희망일"
        options={visitDays}
        value={day}
        onSelect={(v) => {
          setDay(v);
          setError("");
        }}
        className={`${dayColumns(visitDays.length)} [&>button]:px-1`}
      />

      <div className="flex flex-col gap-2.5 text-sm text-ink/80">
        <ConsentRow
          checked={agree}
          onChange={(v) => {
            setAgree(v);
            setError("");
          }}
          notice={PRIVACY_NOTICE}
        >
          [필수] 개인정보 수집·이용에 동의합니다.
        </ConsentRow>
        <ConsentRow checked={marketing} onChange={setMarketing} notice={MARKETING_NOTICE} className="text-muted">
          [선택] 마케팅 정보 수신에 동의합니다.
        </ConsentRow>
      </div>

      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {error && (
        <div role="alert" className="text-sm text-rose">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded border-none bg-primary p-[18px] text-[17px] font-semibold text-white hover:bg-primary-dark disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "예약 접수 중…" : "박람회 사전예약 하기"}
      </button>
    </form>
  );
}
