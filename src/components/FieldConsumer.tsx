import { FC, memo, ReactNode, useContext, ReactElement } from 'react';
import { useForm } from '../hooks';

export interface IFieldConsumer {
    field: string
    children: (props: { value: any, setValue: ((next: any) => any) | any, error: string | null }) => ReactElement<any> | null
    initialValue?: any
}

const FieldConsumer: FC<IFieldConsumer> = props => {

    const [value, setValue, error] = useForm(props.field, props.initialValue)

    return props.children({ value, setValue, error })
}

export default memo(FieldConsumer)