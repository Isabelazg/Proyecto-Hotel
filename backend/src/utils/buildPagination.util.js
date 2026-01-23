/**
 * Construye metadatos de paginación y enlaces
 */
export const buildPagination = ({ total, page, limit, baseUrl, queryWithoutPage }) => {
  const totalPages = Math.ceil(total / limit);
  
  const meta = {
    total,
    page,
    limit,
    totalPages
  };

  const buildLink = (pageNum) => {
    const separator = queryWithoutPage ? '&' : '?';
    return `${baseUrl}?${queryWithoutPage}${separator}page=${pageNum}`;
  };

  const links = {
    first: buildLink(1),
    last: buildLink(totalPages),
    prev: page > 1 ? buildLink(page - 1) : null,
    next: page < totalPages ? buildLink(page + 1) : null
  };

  return { meta, links };
};
