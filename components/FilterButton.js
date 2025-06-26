// components/FilterButton.js
const FilterButton = ({ showFilter, toggleFilter }) => {
    return (
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded shadow md:hidden"
        onClick={toggleFilter}
      >
        {showFilter ? "Скрыть фильтр" : "Показать фильтр"}
      </button>
    );
  };
  
  export default FilterButton;
  