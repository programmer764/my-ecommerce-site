import Link from 'next/link';
import { useRouter } from 'next/router';

const Pagination = ({ currentPage, totalPages, basePath = '/' }) => {
  const router = useRouter();
  const { query } = router;

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {currentPage > 1 && (
        <Link
          href={{
            
            query: { ...query, page: currentPage - 1 },
          }}
        >
          <button className="px-4 py-2 bg-gray-300 text-black rounded-l hover:bg-gray-400 transition">
            Назад
          </button>
        </Link>
      )}

      <span className="px-4 py-2 text-lg font-semibold">
        {currentPage} из {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={{
            
            query: { ...query, page: currentPage + 1 },
          }}
        >
          <button className="px-4 py-2 bg-gray-300 text-black rounded-r hover:bg-gray-400 transition">
            Вперед
          </button>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
