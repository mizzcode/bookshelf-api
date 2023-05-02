const { nanoid } = require('nanoid');
const books = require('./books');

const saveBook = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  let finished = false;

  if (name === null || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (readPage === pageCount) {
    finished = true;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku',
  });
  response.code(500);
  return response;
};

const getAllBooks = (req, h) => {
  const { name, reading, finished } = req.query;

  let filteredBooks = books;

  if (name !== undefined) {
    const query = name.toLowerCase();
    filteredBooks = books.filter((book) => book.name.toLowerCase().includes(query));
  } else if (reading === '1') {
    filteredBooks = books.filter((book) => book.reading === true);
  } else if (reading === '0') {
    filteredBooks = books.filter((book) => book.reading === false);
  } else if (finished === '1') {
    filteredBooks = books.filter((book) => book.finished === true);
  } else if (finished === '0') {
    filteredBooks = books.filter((book) => book.finished === false);
  }

  const response = h.response({
    status: 'success',
    data: {
      // eslint-disable-next-line no-shadow
      books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });

  response.code(200);
  return response;
};

const getDetailBooks = (req, h) => {
  const { bookId } = req.params;

  const selectedBook = books.filter((book) => book.id === bookId)[0];

  if (selectedBook === null || selectedBook === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      selectedBook,
    },
  });
  response.code(200);
  return response;
};

const editBook = (req, h) => {
  const { bookId } = req.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  if (name === null || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbaharui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBook = (req, h) => {
  const { bookId } = req.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });

  return response;
};

module.exports = {
  saveBook,
  getAllBooks,
  getDetailBooks,
  editBook,
  deleteBook,
};
