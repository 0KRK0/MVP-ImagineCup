import Link from "next/link"
import Script from "next/script";
import Head from "next/head";
import './globals.css'

export const metadata = {
  title: 'Major Project',
  description: 'Blockchain Funds Management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
