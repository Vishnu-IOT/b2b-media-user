import React, { useEffect, useRef } from "react";

/**
 * Row of single-digit boxes. Supports typing, backspace, arrow keys,
 * pasting a full code, and one-time-code autofill on phones.
 */
export default function OtpInput({ length = 6, value, onChange, disabled, invalid, autoFocus = true }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    if (autoFocus && refs.current[0]) refs.current[0].focus();
  }, [autoFocus]);

  // After a verification attempt (inputs were disabled), put the cursor back on the first empty box.
  const wasDisabled = useRef(false);
  useEffect(() => {
    if (disabled) {
      wasDisabled.current = true;
    } else if (wasDisabled.current) {
      wasDisabled.current = false;
      const firstEmpty = refs.current.findIndex((el) => el && !el.value);
      const el = refs.current[firstEmpty === -1 ? 0 : firstEmpty];
      if (el) el.focus();
    }
  }, [disabled]);

  const focusAt = (i) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    if (el) {
      el.focus();
      el.select();
    }
  };

  // Writes `chars` into the code starting at box `start`.
  const fill = (start, chars) => {
    const next = digits.slice();
    let i = start;
    for (const ch of chars) {
      if (i >= length) break;
      next[i++] = ch;
    }
    onChange(next.join("").slice(0, length));
    focusAt(Math.min(i, length - 1));
  };

  const handleChange = (i, e) => {
    const chars = e.target.value.replace(/\D/g, "");
    if (!chars) return;
    fill(i, chars);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = digits.slice();
      if (next[i]) {
        next[i] = "";
        onChange(next.join(""));
      } else if (i > 0) {
        next[i - 1] = "";
        onChange(next.join(""));
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const handlePaste = (i, e) => {
    const chars = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!chars) return;
    e.preventDefault();
    fill(chars.length >= length ? 0 : i, chars);
  };

  return (
    <div className={`otp-boxes ${invalid ? "is-invalid" : ""}`} role="group" aria-label="Verification code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className={`otp-box ${d ? "is-filled" : ""}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={length}
          value={d}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
