import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Events | Xordium 5.0',
  description: 'Explore the event line-up and find your place at Xordium 5.0.',
};

export default function EventsLayout({ children }: { children: ReactNode }) {
  return children;
}
