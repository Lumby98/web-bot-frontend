import {ProcessStepEnum} from "../enums/processStep.enum";

export interface ProcessStepDto {
  processStep: ProcessStepEnum;
  errorMessage?: string;
  error: boolean;
}
