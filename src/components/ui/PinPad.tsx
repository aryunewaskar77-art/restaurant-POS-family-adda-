"use client";

import React, { useState } from "react";

interface PinPadProps {
  onSubmit: (pin: string) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
}

export function PinPad({ onSubmit, isLoading, error, title = "Enter PIN", subtitle }: PinPadProps) {
  const [pin, setPin] = useState<string>("");

  const MAX_PIN_LENGTH = 4;

  const handleDigit = (digit: string) => {
    if (isLoading) return;
    if (pin.length < MAX_PIN_LENGTH) {
      setPin((prev) => prev + digit);
    }
  };

  const handleClear = () => {
    if (isLoading) return;
    setPin("");
  };

  const handleBackspace = () => {
    if (isLoading) return;
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (isLoading || pin.length < 4) return;
    onSubmit(pin);
    // Note: Not clearing the pin here so the user sees what they entered if there's an error.
    // In a real app, you might clear it on error.
  };

  // Render mask dots
  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < MAX_PIN_LENGTH; i++) {
      const isFilled = i < pin.length;
      dots.push(
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-colors duration-200 ${
            isFilled ? "bg-brand-600" : "bg-gray-200"
          }`}
        />
      );
    }
    return dots;
  };

  return (
    <div className="flex flex-col items-center max-w-sm w-full mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-6">{subtitle}</p>}

      {error && (
        <div className="w-full bg-red-50 text-red-600 text-sm font-medium py-2 px-3 rounded-lg text-center mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-8 justify-center min-h-6">
        {renderDots()}
      </div>

      <div className="grid grid-cols-3 gap-4 w-full">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            disabled={isLoading}
            className="h-16 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all text-2xl font-semibold text-gray-800 disabled:opacity-50"
          >
            {digit}
          </button>
        ))}
        
        <button
          onClick={handleClear}
          disabled={isLoading}
          className="h-16 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all text-lg font-semibold text-gray-500 disabled:opacity-50"
        >
          C
        </button>
        <button
          onClick={() => handleDigit("0")}
          disabled={isLoading}
          className="h-16 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all text-2xl font-semibold text-gray-800 disabled:opacity-50"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          disabled={isLoading}
          className="h-16 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all text-lg font-semibold text-gray-500 disabled:opacity-50 flex items-center justify-center"
        >
          ⌫
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || pin.length < 4}
        className="w-full mt-6 h-14 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all text-white font-bold text-lg disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Enter"
        )}
      </button>
    </div>
  );
}
