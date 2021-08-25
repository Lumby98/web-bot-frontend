import { Status} from "../enum/status.enum";

export interface ProductDTO {
  brand: string;
  articleName: string;
  articleNo: string;
  status?: Status;
}
