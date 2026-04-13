import type { Dispatch, RefObject, SetStateAction } from 'react';
export type DbEntry = {
  _id: string;
  createdAt: string;
  updatedAt?: string;
  __v: number;
};

export type PostInput = {
  title: string;
  author: string;
  image: string;
  content: string;
};

export type DbPost = DbEntry & PostInput;

export type SetPost = Dispatch<SetStateAction<DbPost | null>>;

export type ModalRef = RefObject<HTMLDialogElement | null>;
