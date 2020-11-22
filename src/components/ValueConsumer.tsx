import React, { FC, memo, ReactNode, useContext, useState, useEffect } from 'react';
import { FormContext } from '../FormContext';

export interface IValueConsumer {
    field: string
    initialValue?: any
    children: ((props: { value: any }) => ReactNode) | ReactNode;
}

const ValueConsumer: FC<IValueConsumer> = props => {

    const ctx = useContext(FormContext)

    const [value, setValue] = useState(ctx?.controller.get(props.field) || props.initialValue || undefined);

    useEffect(() => {
        if (!ctx) return;

        const sub = ctx.controller.subscribe("values", (values) => {
            setValue(values[props.field])
        })
        return () => {
            sub.unsubscribe();
        }
    }, [ctx])

    if(!ctx) return null;

    if (props.children instanceof Function) {
        return props.children({ value })
    }else{
        if(value) return props.children as any
        else return null
    }

}

export default memo(ValueConsumer)