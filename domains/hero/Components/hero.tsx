"use client";

import "./scss/hero.scss";
import Footer from "./forms/footer";
import Header from "./forms/header";
import Component from "./forms/component";

export default function Hero() {


  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans dark:bg-black">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white text-gray-800 shadow-md">
        <Header />
      </header>

      <main className="flex-1">
        <Component />
      </main>

      <footer className="bg-gray-900 text-gray-400">
        <Footer />
      </footer>

    </div>
  );
}