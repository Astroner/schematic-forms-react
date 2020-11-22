import React, { FC, memo, ReactNode, useContext } from 'react';
import { FormContext } from '../FormContext';
import { usePending } from '../hooks';

export interface IPendingConsumer {
    children: ReactNode | ((data: { isPending: boolean }) => ReactNode)
}

const PendingConsumer: FC<IPendingConsumer> = ({ children }) => {

    const { controller } = useContext(FormContext)

    const { isPending } = usePending(controller);

    if(children instanceof Function) {
        return children({ isPending }) as any
    }

    if(isPending) return children

    return null
}

export default PendingConsumer