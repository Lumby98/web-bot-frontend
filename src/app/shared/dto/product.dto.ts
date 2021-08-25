import { Status} from "../enum/status.enum";

export interface ProductDTO {
  articleName: string;
  articleNo: string;
  brand: string;
  status?: Status;
}
