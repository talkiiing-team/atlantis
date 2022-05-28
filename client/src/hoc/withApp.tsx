import React from 'react'
import { pokeCore, PokeApp } from '@/services/pokeCore'

type ResultComponentPropsType<P> = Omit<P, 'app'> & { app: PokeApp }

export function withApp<Props = any>(
  Component: React.FunctionComponent<ResultComponentPropsType<Props>>,
): React.FC<Props> {
  return props => <Component {...props} app={pokeCore} />
}
