"use client";

import { Disclosure, Menu, Transition } from "@headlessui/react";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return <>{children}</>;
}
