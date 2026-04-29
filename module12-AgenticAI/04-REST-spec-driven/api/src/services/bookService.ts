import { Book } from '../models/Book';
import { AppError } from '../middleware/errorHandler';
import type { CreateBookInput, UpdateBookInput, PaginationInput } from '../types';

export const createBook = async (input: CreateBookInput) => {
  const existing = await Book.findOne({ isbn: input.isbn });
  if (existing) {
    throw new AppError(409, 'A book with this ISBN already exists');
  }

  const book = await Book.create(input);
  return book.populate('author');
};

export const getAllBooks = async (pagination: PaginationInput) => {
  const { page, limit, search } = pagination;
  const query: any = {};

  if (search) {
    query.$text = { $search: search };
  }

  const total = await Book.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  let booksQuery = Book.find(query)
    .populate('author')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (search) {
    booksQuery = booksQuery.sort({ score: { $meta: 'textScore' } } as any);
  }

  const books = await booksQuery;

  return {
    data: books,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

export const getBookById = async (id: string) => {
  const book = await Book.findById(id).populate('author');
  if (!book) {
    throw new AppError(404, 'Book not found');
  }
  return book;
};

export const updateBook = async (id: string, input: UpdateBookInput) => {
  if (input.isbn) {
    const existing = await Book.findOne({ isbn: input.isbn, _id: { $ne: id } });
    if (existing) {
      throw new AppError(409, 'A book with this ISBN already exists');
    }
  }

  const book = await Book.findByIdAndUpdate(id, input, {
    returnDocument: 'after',
    runValidators: true,
  }).populate('author');

  if (!book) {
    throw new AppError(404, 'Book not found');
  }
  return book;
};

export const deleteBook = async (id: string) => {
  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    throw new AppError(404, 'Book not found');
  }
  return { message: 'Book deleted successfully' };
};