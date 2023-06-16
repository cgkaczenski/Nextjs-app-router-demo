import Navbar from "@/components/navbar";
import Provider from "@/components/provider";
import { Suspense } from "react";

export default async function MainNavigation() {
  return (
    <Provider>
      <Navbar />
    </Provider>
  );
}
