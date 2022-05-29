import { atom } from 'recoil'

export const currentRecordsStore = atom<string>({
  key: 'currentRecordsStore',
  default: '',
})
