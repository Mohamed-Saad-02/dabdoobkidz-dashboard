import { ReactElement } from 'react';


export type MenuItem = {
    key: string;
    label: string;
    icon?: ReactElement;
    children?: MenuItem[];
    type?: string;
  };