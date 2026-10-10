import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Contact Us | Xordium 5.0',
  description: 'Contact the Xordium 5.0 organizing team with your questions, ideas, or partnership enquiries.',
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
