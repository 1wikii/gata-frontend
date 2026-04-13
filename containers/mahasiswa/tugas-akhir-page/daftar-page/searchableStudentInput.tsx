import React, { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/utils/api";
import { FormData } from "./index";

export type Student = {
  id: number | string;
  name: string;
  email: string;
  studentId: string;
};

type Props = {
  // Optional: custom fetch function. If not provided, component will call
  // GET /api/students?query=... and expect JSON array of Student
  value: string;
  name: string;
  handleInputChange?: (s: Student | null) => void;
  handleInputBlur: (name: keyof FormData) => void;
  placeholder?: string;
  debounceMs?: number;
  minChars?: number;
  className?: string;
};

export default function SearchableStudentSelect({
  value,
  name,
  handleInputChange,
  handleInputBlur,
  placeholder = "Cari dengan email...",
  debounceMs = 300,
  minChars = 2,
}: Props) {
  const [inputValue, setInputValue] = useState<string>(value || "");
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debRef = useRef<number | null>(null);

  // Sync inputValue with value prop when it changes externally
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // memoized fetch function
  const fetchStudents = useCallback(async (q: string, signal?: AbortSignal) => {
    const res = await api.get(
      "/mahasiswa/tugas-akhir?query=" + encodeURIComponent(q),
      signal
    );

    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.data as Student[];
  }, []);

  useEffect(() => {
    // clear pending debounce on unmount
    return () => {
      if (debRef.current) window.clearTimeout(debRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (debRef.current) window.clearTimeout(debRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  useEffect(() => {
    // avoid running when query is too short
    if (query.length < minChars) {
      setOptions([]);
      setLoading(false);
      setError(null);
      return;
    }

    if (debRef.current) window.clearTimeout(debRef.current);

    debRef.current = window.setTimeout(() => {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      setError(null);

      fetchStudents(query, ctrl.signal)
        .then((rows) => {
          setOptions(rows || []);
          setOpen(true);
          setHighlightIndex(0);
        })
        .catch((err) => {
          if (!err) return;
          if (err.name === "AbortError") return;
          console.error(err);
          setError(err.message ?? "Gagal mengambil data");
        })
        .finally(() => setLoading(false));
    }, debounceMs);
    // IMPORTANT: only include stable deps. fetchFn is stable because defaultFetch is memoized and
    // fetchStudents (if provided) is assumed to be stable from parent. If parent passes a new
    // function each render, memoize it there or wrap with useCallback.
  }, [query, debounceMs, minChars, fetchStudents]);

  // keyboard handlers
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((hi) =>
        Math.min(options.length - 1, Math.max(0, hi + 1))
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((hi) => Math.max(0, hi - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (open && options[highlightIndex]) {
        selectOption(options[highlightIndex]);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
  }

  function selectOption(s: Student) {
    handleInputChange?.(s);
    setInputValue(s.email);
    setOpen(false);
    setHighlightIndex(-1);
  }

  function clearSelection() {
    handleInputChange?.(null);
    setQuery("");
    setInputValue("");
    setOptions([]);
    setOpen(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange?.(null);
    setQuery(e.target.value);
    setInputValue(e.target.value);
  };

  return (
    <div className="relative">
      <input
        className="form-input"
        ref={inputRef}
        name={name}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="student-listbox"
        aria-autocomplete="list"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onBlur={() => handleInputBlur(name as keyof FormData)}
        onKeyDown={onKeyDown}
      />

      {loading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">
          Loading...
        </div>
      )}

      {inputValue && (
        <button
          type="button"
          onClick={clearSelection}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer text-red-500"
          aria-label="Clear selection"
        >
          ×
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <ul
          id="student-listbox"
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border bg-white shadow-lg"
        >
          {error && (
            <li className="p-2 text-sm text-red-600">Error: {error}</li>
          )}

          {!error && options.length === 0 && !loading && query.length > 0 && (
            <li className="p-2 text-sm text-gray-500">Tidak ada hasil</li>
          )}

          {query.length > 0 &&
            options.map((opt, idx) => {
              const hi = idx === highlightIndex;
              return (
                <li
                  key={opt.id}
                  role="option"
                  aria-selected={hi}
                  onMouseDown={(e) => {
                    // use onMouseDown so input doesn't lose focus before click
                    e.preventDefault();
                    selectOption(opt);
                  }}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  className={`cursor-pointer px-3 py-2 flex justify-between items-center text-sm ${
                    hi ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{opt.name}</span>
                    <span className="text-xs text-gray-500">{opt.email}</span>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
