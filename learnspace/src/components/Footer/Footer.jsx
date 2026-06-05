import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto bg-[#1c1d1f] text-white py-12 px-6 md:px-12 border-t border-gray-800 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div className="text-lg font-black text-white tracking-tighter">
          LearnSpace
        </div>
        <div>&copy; 2026 LearnSpace, Inc.</div>
      </div>
    </footer>
  );
};

export default Footer;
