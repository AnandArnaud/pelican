import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pelican Outfitters — Support",
  description: "Chat with Pelican, our support assistant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#fbfbfa",
          color: "#1b1b19",
        }}
      >
        {children}
      </body>
    </html>
  );
}
