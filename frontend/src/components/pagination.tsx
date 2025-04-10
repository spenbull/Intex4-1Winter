import './admin-styles/pagination.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newSize: number) => void;
    theme?: 'light' | 'dark';
}

const Pagination = ({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
    theme = 'light'
}: PaginationProps) => {
    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1); // Always show first page

            if (currentPage > 2) pages.push('...');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 1) pages.push('...');

            pages.push(totalPages); // Always show last page
        }

        return pages;
    };

    return (
        <div className="pagination-container" data-theme={theme}>
            <div className="pagination-buttons">
                <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    ◀ Previous
                </button>

                {generatePageNumbers().map((page, index) =>
                    typeof page === 'number' ? (
                        <button
                            key={page}
                            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                            &hellip;
                        </span>
                    )
                )}

                <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next ▶
                </button>
            </div>

            <div className="pagination-page-size">
                <label>
                    Results per Page:
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            onPageSizeChange(Number(e.target.value));
                            onPageChange(1);
                        }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default Pagination;