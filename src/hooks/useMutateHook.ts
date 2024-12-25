import { useMutation } from "react-query";


export const useMutateHook = (key , properites) => {
  return useMutation(key , properites);
};
