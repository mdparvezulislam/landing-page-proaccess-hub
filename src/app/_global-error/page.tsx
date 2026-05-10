import React from "react";

export default function GlobalErrorPage() {
  return (
    <html lang="en">
      <body className="bg-bg-dark text-text-primary antialiased">
        <div style={{ padding: 32, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ opacity: 0.8 }}>An unexpected error occurred.</p>
        </div>
      </body>
    </html>
  );
}
