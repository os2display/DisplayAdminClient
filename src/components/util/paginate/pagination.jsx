import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

/**
 * @param {object} props
 * The props.
 * @param {number} props.itemsCount
 * The amount of data to be spread out in pages.
 * @param {number} props.pageSize
 * The page size
 * @param {Function} props.onPageChange
 * The callback for page change.
 * @param {number} props.currentPage
 * The current page.
 * @returns {object}
 * The pagination.
 */
function Pagination({ itemsCount, pageSize, onPageChange, currentPage }) {
  const { t } = useTranslation("common");
  const pageCount = Math.ceil(itemsCount / pageSize);
  // No need for pagination
  if (pageCount <= 1) return null;

  // Array of numbers from 1 ... pagecount.
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label={t("pagination.aria-label")}>
      <ul className="pagination">
        {pages.map((page) => (
          <li
            key={page}
            className={page === currentPage ? "page-item active" : "page-item"}
          >
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className="page-link"
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
