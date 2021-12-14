export enum LoginTypeEnum {
  ORTOWEAR,
  NESKRID,
  HULTAFORS,
}

export const LoginTypeMapping = [
  { value: LoginTypeEnum.ORTOWEAR, type: 'Ortowear' },
  { value: LoginTypeEnum.NESKRID, type:  'Neskrid' },
  { value: LoginTypeEnum.HULTAFORS, type:  'Hultafors' },
];
