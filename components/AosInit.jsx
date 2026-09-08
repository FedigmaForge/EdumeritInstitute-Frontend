"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function AosInit() {
  useEffect(() => {
    AOS.init({ duration: 650, once: true, offset: 60 });
  }, []);

  return null;
}
