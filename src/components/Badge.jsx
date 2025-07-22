// src/components/Badge.jsx
import React from 'react';

export default function Badge({ label, color }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${color}`}>
      {label}
    </span>
  );
}
