import React, { FC, memo, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { FormContext } from '../FormContext';

export interface IErrorConsumer {
    children: 
        | ReactNode 
        | ((
            props: { hasError: true, errorCode: string } | { hasError: false, errorCode: null }
        ) => ReactNode)
    
    /** @description observable controller field*/
    field?: string
    
    /** @description error type */
    error?: string
}

const ErrorConsumer: FC<IErrorConsumer> = props => {

    const context = useContext(FormContext);
    
    const [error, setError] = useState<null | string>(null)
    const hasError = useMemo(() => {
        return !!error
    }, [error])
    
    useEffect(() => {
        if (!context?.controller) return
        const sub = context.controller.subscribe("errors", (errors) => {
            if (!props.field) {
                setError(Object.keys(errors).length > 0 ? "ERRORS" : null)
            }else{
                if(props.field in errors){
                    if (props.error){
                        if (errors[props.field] === props.error) {
                            setError(props.error)
                        } else {
                            setError(null)
                        }
                    }else{
                        setError(errors[props.field] || null)
                    }
                }else{
                    setError(null)
                }
            }
        })
        return () => {
            sub.unsubscribe();
        }
    }, [context, props.error, props.field])

    if (props.children instanceof Function) {
        return (
            <>
                {props.children({ hasError, errorCode: error } as any)}
            </>
        )
    }

    return (
        <>
            {hasError ? props.children : null}
        </>
    )
}

export default memo(ErrorConsumer)