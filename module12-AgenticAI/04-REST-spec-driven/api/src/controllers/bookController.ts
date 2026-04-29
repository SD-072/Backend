import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as bookService from '../services/bookService';

const getParamsId = (req: Request): string => {
  const validated = (req as any).validatedParams;
  return validated ? validated.id : req.params.id as string;
};

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  const book = await bookService.createBook(req.body);
  res.status(201).json(book);
};

export const list = async (req: Request, res: Response): Promise<void> => {
  const validated = (req as any).validatedQuery || req.query;
  const result = await bookService.getAllBooks(validated);
  res.status(200).json(result);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const book = await bookService.getBookById(getParamsId(req));
  res.status(200).json(book);
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  const book = await bookService.updateBook(getParamsId(req), req.body);
  res.status(200).json(book);
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await bookService.deleteBook(getParamsId(req));
  res.status(200).json(result);
};