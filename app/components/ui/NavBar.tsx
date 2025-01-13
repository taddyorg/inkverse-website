import { useState } from "react";
import { useMatches, useNavigate } from "react-router";

interface NavbarProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

function Navbar({ isDarkMode, onThemeToggle }: NavbarProps) {
  const ignoreNavRoutes = ["/blog", "/terms-of-service", "/open-source", "/brand-kit"];
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);

  const matches = useMatches();
  const navigate = useNavigate();

  // Check if the current route starts with any of the ignoreNavRoutes
  const ignoreNav = matches.some((match) => 
    ignoreNavRoutes.some(route => match.pathname.startsWith(route))
  );

  function handleSearch(e?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) {
    navigate(`/search/${searchTerm}`);
  }

  return (ignoreNav ? null :
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full pt-4 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/">
              <img className="h-14 w-auto sm:h-16" src="https://ax0.taddy.org/inkverse/inkverse-square-transparent.png" alt="Inkverse Logo" />
            </a>
          </div>
          <div className='flex flex-row items-center'>
            <div className="flex items-center mr-4">
              <svg onClick={() => setShowSearchBox(!showSearchBox)} 
                   xmlns="http://www.w3.org/2000/svg" 
                   className="h-6 w-6 cursor-pointer mr-2 dark:stroke-white stroke-gray-900" 
                   fill="none" 
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700/20 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:stroke-white stroke-gray-900" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:stroke-white stroke-gray-900" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        {showSearchBox && (
          <>
            <div className="relative mt-2">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-4 pr-20 py-2 border rounded-full w-full" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyDown={(e) => {if (e.key === 'Enter') handleSearch()}} 
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="text-black font-bold py-2 px-4">
                    x
                  </button>
                )}
                <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full">
                  Search
                </button>
              </div>
            </div>
          </>
        )}
    </nav>
  )
}

export default Navbar;