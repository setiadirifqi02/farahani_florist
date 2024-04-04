import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword?.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate("/");
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="search-bar__container w-[360px] md:w-[340px] relative py-5"
    >
      <div className="relative">
        <input
          type="text"
          id="search_field"
          placeholder="Search product here"
          aria-label="serach_btn"
          name="keyword"
          value={keyword}
          className="w-full p-2 text-sm md:text-md rounded-full
           bg-gray-50 outline-1 outline-green-600"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          id="search_btn"
          ype="button"
          className="absolute z-20 right-1 top-1/2 -translate-y-1/2
           bg-green-500 text-white p-2 rounded-full"
        >
          <MagnifyingGlassIcon className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
export default SearchBar;
