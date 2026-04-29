import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as authorService from '../services/authorService';

const getParamsId = (req: Request): string => {
  const validated = (req as any).validatedParams;
  return validated ? validated.id : req.params.id as string;
};

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  const author = await authorService.createAuthor(req.body);
  res.status(201).json(author);
};

export const list = async (_req: Request, res: Response): Promise<void> => {
  const authors = await authorService.getAllAuthors();
  res.status(200).json(authors);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const author = await authorService.getAuthorById(getParamsId(req));
  res.status(200).json(author);
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  const author = await authorService.updateAuthor(getParamsId(req), req.body);
  res.status(200).json(author);
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await authorService.deleteAuthor(getParamsId(req));
  res.status(200).json(result);
};