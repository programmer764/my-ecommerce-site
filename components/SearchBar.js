// components/SearchBar.js
import { useState } from "react";
import { useRouter } from "next/router";

const SearchBar = () => {
  const router = useRouter();
  const { search } = router.query;
  const [searchQuery, setSearchQuery] = useState(search || "");

  // Функция для применения поиска
  const handleSearch = () => {
    const query = {};
    if (searchQuery.trim()) {
      query.search = searchQuery.trim();
    }
    router.push({ pathname: "/", query });
  };

  return (
    <div className="flex items-center  pl-2">
  <input
    type="text"
    placeholder=""
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="border p-2 rounded-full w-96 placeholder-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <button
    className="bg-blue-800 text-white ml-4  px-4 py-2 "
    onClick={handleSearch}
  >
    Искать
  </button>
</div>

  );
};

export default SearchBar;

