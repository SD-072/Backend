import { Author } from '../models/Author';
import { AppError } from '../middleware/errorHandler';
import type { CreateAuthorInput, UpdateAuthorInput } from '../types';

export const createAuthor = async (input: CreateAuthorInput) => {
  const author = await Author.create(input);
  return author;
};

export const getAllAuthors = async () => {
  const authors = await Author.find().sort({ name: 1 });
  return authors;
};

export const getAuthorById = async (id: string) => {
  const author = await Author.findById(id);
  if (!author) {
    throw new AppError(404, 'Author not found');
  }
  return author;
};

export const updateAuthor = async (id: string, input: UpdateAuthorInput) => {
  const author = await Author.findByIdAndUpdate(id, input, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!author) {
    throw new AppError(404, 'Author not found');
  }
  return author;
};

export const deleteAuthor = async (id: string) => {
  const author = await Author.findByIdAndDelete(id);
  if (!author) {
    throw new AppError(404, 'Author not found');
  }
  return { message: 'Author deleted successfully' };
};