import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lets Unbound | Student Success',
  description: 'A transparent record of student admissions and university destinations.'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
