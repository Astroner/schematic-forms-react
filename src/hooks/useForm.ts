import { FormContext } from '../FormContext';
import { useContext, useState, useCallback, useEffect } from 'react';

type RT<ValueType, HasDefault extends boolean = false> = HasDefault extends true ? [
    ValueType, 
    (nextVal: ValueType | ((prevValue?: ValueType) => ValueType | undefined)) => void,
    string | null
] : [
    ValueType | undefined, 
    (nextVal: ValueType | ((prevValue?: ValueType) => ValueType | undefined)) => void,
    string | null
]

function useForm<ValueType>(name: string, nullValue: ValueType): RT<ValueType, true>
/**
 * 
 * @param name field name
 * @param initialValue initial value for field
 * 
 * @returns array like [value, setValue, error]
 * 
 * @description use this hook if u want to hook into FormLayout lifecicle
 */
function useForm<ValueType>(name: string): RT<ValueType>
function useForm<ValueType>(
    name: string,
    nullValue?: ValueType
): RT<ValueType>{
    const context = useContext(FormContext)

    const [state, setState] = useState<ValueType | undefined>(context?.controller.getValues()[name] || nullValue)

    const [error, setErrors] = useState<string | null>(context?.controller.errors.getState()[name] || null)

    useEffect(() => {
        if(!context) return 
        const sub1 = context.controller.subscribe("values", (values) => {
            setState(values[name])
        })
        const sub2 = context.controller.subscribe("errors", (errors) => {
            setErrors(errors[name] || null)
        })
        return () => {
            sub1.unsubscribe()
            sub2.unsubscribe();
        }
    }, [context, name])

    // console.log(`> New value ${name}: ${JSON.stringify({ value: state })}`)

    const change = useCallback((nextVal: ValueType | ((prevValue?: ValueType) => ValueType | undefined)) => {
        if (nextVal instanceof Function){
            context?.controller.change(name, nextVal(context?.controller.get(name)))
        }else{
            context?.controller.change(name, nextVal)
        }
    }, [name, context])

    return [state, change, error]
}

export default useForm