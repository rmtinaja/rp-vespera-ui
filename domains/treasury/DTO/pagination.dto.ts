import { TransactionDTO } from './transaction.dto';

export interface PaginationDTO {
  current_page: number;
  data: TransactionDTO[];
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
}