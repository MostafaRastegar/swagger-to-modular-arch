import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      </div>
    </header>
  );
};

export default Header;
