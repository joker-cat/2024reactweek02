function Pagunation({
  pageinfo,
  getProductsHandler,
  getAdminProductsHandler,
  loginStatus,
}) {
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${!pageinfo.has_pre && "disabled"}`}>
          <a
            className="page-link"
            href="#"
            onClick={() =>
              loginStatus
                ? getAdminProductsHandler(pageinfo.current_page - 1)
                : getProductsHandler(pageinfo.current_page - 1)
            }
          >
            上一頁
          </a>
        </li>
        {Array.from({ length: pageinfo.total_pages }).map((_, idx) => {
          return (
            <li
              onClick={() =>
                loginStatus
                  ? getAdminProductsHandler(idx + 1)
                  : getProductsHandler(idx + 1)
              }
              className={`page-item ${
                pageinfo.current_page === idx + 1 && "active"
              }`}
              key={idx + 1}
            >
              <a className="page-link" href="#">
                {idx + 1}
              </a>
            </li>
          );
        })}

        <li className={`page-item ${!pageinfo.has_next && "disabled"}`}>
          <a
            className="page-link"
            href="#"
            onClick={() =>
              loginStatus
                ? getAdminProductsHandler(pageinfo.current_page + 1)
                : getProductsHandler(pageinfo.current_page + 1)
            }
          >
            下一頁
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagunation;
