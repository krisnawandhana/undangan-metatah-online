"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check, LoaderCircle, Send } from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { RSVP_LIMITS, validateRsvp } from "@/lib/rsvp";
import { RsvpRequestError, submitRsvp, type RsvpErrorCode } from "@/lib/rsvp-client";
import { cn } from "@/lib/utils";
import type { RsvpErrors, RsvpField, RsvpInput } from "@/types/rsvp";

type Status = "idle" | "submitting" | "success" | "error";

const ERROR_TEXT: Record<RsvpErrorCode, string> = {
  VALIDATION_ERROR: "Mohon periksa kembali isian Anda.",
  DUPLICATE: "Ucapan yang sama dari nama ini sudah kami terima sebelumnya. Matur suksma.",
  RATE_LIMITED: "Terlalu banyak percobaan dalam waktu singkat. Mohon coba lagi beberapa menit lagi.",
  NETWORK: "Koneksi terputus. Periksa jaringan Anda, lalu coba kirim kembali.",
  UNAVAILABLE: "Maaf, layanan sedang tidak dapat menerima ucapan. Mohon coba lagi nanti.",
};

type Props = {
  defaultName: string;
  onSubmitted: () => void;
};

const FIELD_ORDER: RsvpField[] = ["name", "attendance", "guests", "message"];

const inputClass =
  "w-full border border-line bg-ivory px-4 py-3 text-base text-brown placeholder:text-brown-soft/60 transition-colors focus:border-gold-ink focus:outline-none aria-[invalid=true]:border-terracotta";

export function RSVPForm({ defaultName, onSubmitted }: Props) {
  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    attendance: `${uid}-attendance`,
    guests: `${uid}-guests`,
    message: `${uid}-message`,
  };
  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState<RsvpInput>({
    name: defaultName,
    attendance: "",
    guests: "1",
    message: "",
  });
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorCode, setErrorCode] = useState<RsvpErrorCode>("UNAVAILABLE");
  const [sentName, setSentName] = useState("");
  // Honeypot: hidden from people, tempting for form-filling bots.
  const [website, setWebsite] = useState("");

  const set = <K extends RsvpField>(key: K, value: RsvpInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const showErrors = (fieldErrors: RsvpErrors) => {
      setErrors(fieldErrors);
      const first = FIELD_ORDER.find((f) => fieldErrors[f]);
      if (first) {
        const el = formRef.current?.querySelector<HTMLElement>(
          first === "attendance" ? `input[name="attendance"]` : `#${CSS.escape(ids[first])}`,
        );
        el?.focus();
      }
    };

    const result = validateRsvp(values);
    if (!result.ok) {
      showErrors(result.errors);
      return;
    }

    setStatus("submitting");
    try {
      await submitRsvp({ ...values, website });
      setSentName(result.data.name);
      setStatus("success");
      onSubmitted();
    } catch (err) {
      const code = err instanceof RsvpRequestError ? err.code : "UNAVAILABLE";
      if (code === "VALIDATION_ERROR" && err instanceof RsvpRequestError && err.fields) {
        setStatus("idle");
        showErrors(err.fields);
        return;
      }
      setErrorCode(code);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="bg-ivory px-6 py-12 text-center sm:px-10">
        <span className="mx-auto grid size-12 place-items-center rounded-full border border-sage text-sage-ink">
          <Check size={22} />
        </span>
        <p className="mt-6 font-serif text-[1.75rem] leading-tight font-medium">
          Matur suksma, {sentName}
        </p>
        <p className="mx-auto mt-3 max-w-[24rem] text-brown-soft">
          Konfirmasi serta ucapan dan doa restu Anda telah kami terima.
        </p>
      </div>
    );
  }

  const attending = values.attendance === "hadir";
  const submitting = status === "submitting";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={submitting}
      className="relative space-y-7 bg-ivory px-5 py-10 sm:px-10 sm:py-12"
    >
      {/* Name */}
      <div>
        <Label htmlFor={ids.name}>Nama Tamu</Label>
        <input
          id={ids.name}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={RSVP_LIMITS.nameMax}
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${ids.name}-error` : undefined}
          className={inputClass}
          required
        />
        <FieldError id={`${ids.name}-error`} message={errors.name} />
      </div>

      {/* Attendance */}
      <fieldset aria-describedby={errors.attendance ? `${ids.attendance}-error` : undefined}>
        <legend className="mb-2 text-sm font-bold">
          Konfirmasi Kehadiran <span className="text-terracotta-ink" aria-hidden="true">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["hadir", "Hadir"],
              ["tidak_hadir", "Tidak Dapat Hadir"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={cn(
                "flex min-h-12 cursor-pointer items-center justify-center border px-3 py-3 text-center text-[0.9375rem] transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-ink",
                values.attendance === value
                  ? "border-brown bg-brown text-ivory"
                  : errors.attendance
                    ? "border-terracotta bg-ivory"
                    : "border-line bg-ivory hover:border-brown/50",
              )}
            >
              <input
                type="radio"
                name="attendance"
                value={value}
                checked={values.attendance === value}
                onChange={() => set("attendance", value)}
                className="sr-only"
                required
              />
              {label}
            </label>
          ))}
        </div>
        <FieldError id={`${ids.attendance}-error`} message={errors.attendance} />
      </fieldset>

      {/* Guests — only relevant when attending */}
      {attending && (
        <div>
          <Label htmlFor={ids.guests} optional>
            Jumlah Tamu
          </Label>
          <input
            id={ids.guests}
            name="guests"
            type="number"
            inputMode="numeric"
            min={RSVP_LIMITS.guestsMin}
            max={RSVP_LIMITS.guestsMax}
            value={values.guests}
            onChange={(e) => set("guests", e.target.value)}
            aria-invalid={!!errors.guests}
            aria-describedby={`${ids.guests}-hint${errors.guests ? ` ${ids.guests}-error` : ""}`}
            className={cn(inputClass, "numerals max-w-[8rem]")}
          />
          <p id={`${ids.guests}-hint`} className="mt-1.5 text-sm text-brown-soft">
            Termasuk Anda sendiri.
          </p>
          <FieldError id={`${ids.guests}-error`} message={errors.guests} />
        </div>
      )}

      {/* Message */}
      <div>
        <Label htmlFor={ids.message}>Ucapan &amp; Doa Restu</Label>
        <textarea
          id={ids.message}
          name="message"
          rows={4}
          maxLength={RSVP_LIMITS.messageMax}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={`${ids.message}-count${errors.message ? ` ${ids.message}-error` : ""}`}
          className={cn(inputClass, "resize-y leading-relaxed")}
          required
        />
        <div className="mt-1.5 flex items-start justify-between gap-4">
          <FieldError id={`${ids.message}-error`} message={errors.message} inline />
          <p id={`${ids.message}-count`} className="numerals ml-auto shrink-0 text-sm text-brown-soft">
            {values.message.length}/{RSVP_LIMITS.messageMax}
          </p>
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="border-l-2 border-terracotta bg-cream px-4 py-3 text-[0.9375rem]">
          {ERROR_TEXT[errorCode]}
        </p>
      )}

      <PrimaryButton type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <LoaderCircle size={18} className="motion-safe:animate-spin" />
            Mengirim…
          </>
        ) : (
          <>
            <Send size={17} />
            Kirim Ucapan
          </>
        )}
      </PrimaryButton>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>
    </form>
  );
}

function Label({ htmlFor, optional, children }: { htmlFor: string; optional?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-bold">
      {children}{" "}
      {optional ? (
        <span className="font-normal text-brown-soft">(opsional)</span>
      ) : (
        <span className="text-terracotta-ink" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

function FieldError({ id, message, inline }: { id: string; message?: string; inline?: boolean }) {
  if (!message) return null;
  return (
    <p id={id} className={cn("text-sm text-terracotta-ink", !inline && "mt-1.5")}>
      {message}
    </p>
  );
}
