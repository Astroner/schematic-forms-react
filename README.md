#### Description
Schematic forms is schema based form processing library for react writen with typescript.

#### Instalation
> npm i --save @schematic-forms/core @schematic-forms/react

#### Usage
Library uses context and hooks(or render props) as a main concept of usage.

```tsx
import React, { FC } from 'react'
import { useController, FormProvider, FieldConsumer } from '@schematic-forms/react'
import { Str } from '@schematic-forms/core'

export const Form: FC<{}> = () => {
    const { controller, submit } = useController({
        fields: {
            email: Str(true),
            password: Str(true)
        },
        validators: {
            email: EmailValidator("INCORRECT_EMAIL")
        },
        submit: (data) => {
            console.log(data)
        }
    })

    return (
        <FormProvider controller={controller} >
            <FieldConsumer field="email">
                {({ value, setValue, error }) => (
                    <div>
                        {error}
                        <input value={value} onChange={e => setValue(e.target.value)} />
                    </div>
                )}
            </FieldConsumer>
            <FieldConsumer field="password">
                {({ value, setValue, error }) => (
                    <div>
                        {error}
                        <input value={value} onChange={e => setValue(e.target.value)} />
                    </div>
                )}
            </FieldConsumer>
            <ErrorConsumer>
                {({ hasError }) => (
                    <button disabled={hasError} onClick={submit} >Submit</button>
                )}
            </ErrorConsumer>
        </FormProvider>
    )
}
```
What's going on here, yeah? Let me explain. Lets start with useController() hook. it takes config and returns object like { controller, submit } 
```typescript
type config = {
    fields: {
        [key: string]: SchemaType
    },
    validators: {
        [key: string]: (value: FieldValue) => void | Error
    },
    submit: (data: Data) => void | { [key: string]: Error } | Promise<void | { [key: string]: Error }>
}
```
From top into bottom: 
 - fields - form fields. keys - common string, values something like Str(), Bool(), Num(), that u can import from @schematic-forms/core
 - validators - object with field validation functions.
 - submit - function that will be executed when all form conditions are met. submit will get form data and should return void or error map (also it can returns a Promise).

Then we'll take **FormProvider** component. It's simple context provider requiring controller that useController() returns, no more.

**FieldConsumer** is dirty(but easy) way to change fields. takes only one prop: field - field name to control. As children takes function with following type
```typescript
type RenderFunction = (
    props: { value: any, setValue: (nextValue: any
) => void, error: null | string }) => ReactNode
```
value and setValue react's useState() like functions. error will provide errors on this field

**ErrorConsumer** represents exception handling. 
```typescript
type ErrorConsumerProps = {
    field?: string
    code?: string
}
``` 
If no props will be provided **ErrorConsumer** will react on any exception in any fields. 
As children u can pass RenderFunction like in example above or just ReactNode.

#### Value types

Types you can pass in "fields" object.
```ts
const fields = {
    str: Str(required: boolean, defaultValue: string),
    num: Num(required: boolean, defaultValue: number),
    object: Obj(
        objectSchema: ObjectSchema, 
        required: boolean, 
        defaultValue: ObjectSchemaRealization
    ),
    enum: Enum(variant: Variant[], required: true, defaultValue: Variant),
    array: Arr(
        arrType: SchemaFieldType, 
        require: boolean, 
        defaultValue: SchemaFieldType[]
    ),
    mix: Mix(TypeToMix[], required: boolean, defaultValue: TypeToMix)
}
// Object type example
const book = Obj({
    title: Str(true),
    count: Num(true),
    author: Obj({
        name: Str(true),
        email: Str(true)
    })
}, true)

// Enum type example
const gender = Arr<["M", "F"]>(["M", "F"], true) 
/* 
You have to use generic argument because typescript identify array like ["M", "F"] as string array.
*/

// Array type example
const titles = Arr(Str(true), true)

// Mix type example
const mixedType = Mix([
    Str(true),
    Obj({ title: Str(true) }, true)
])
```

#### Hooks 

##### useForm

useForm is a clear way to change controller fields and create custom form fields.
```tsx
function useForm<ValueType>(
    name: string, 
    nullValue?: ValueType
): [
    ValueType | undefined, // value
    | (nextVal: ValueType // change function
    | ((prevValue?: ValueType) => ValueType | undefined)) => void,
    string | null // error
]
// Example
const FormInput: FC<{ name: string }> = ({ name }) => {
    const [value, setValue, error] = useForm(name, "");
    
    return (
        <div>
            {error}
            <input 
                value={value} 
                onChenge={e => setValue(e.target.value)} 
            />
        </div>
    )
}
```
##### useHasError

Returns true if controller has errors and false if not.
```tsx
// ... react component with useController hook
const hasErrors = useHasError(controller)
return (
    <div>
        {hasErrors && "ERRORS!"}
        {/* ... */}
    </div>
)
```

##### usePending

If your submit function return Promise you probably want to know it`s status. usePending returns { isPending: true } if promise is pending and { isPending: false } if not.
```tsx
// ... react component with useController hook
const { isPending } = usePending(controller)
return (
    <div>
        {isPending && "LOADING..."}
        {/* ... */}
    </div>
)
```

##### useValue

Return controller field value
```tsx
// ... react component with useController hook
const { controller } = useController({
})
const { isPending } = usePending(controller)
return (
    <div>
        {isPending && "LOADING..."}
        {/* ... */}
    </div>
)
```
#### Components

##### ErrorConsumer

Cunsumes controller errors using context.
```tsx
interface ErrorConsumerProps {
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
```
 - Without "field" prop component will triggers on any error in any field. 
 - "error" prop specify which error type in "field" should trigger re-render.

```tsx
// Example
// ... react component with useController hook
const { controller } = useController({
    fields: {
        email: Str(true)
    },
    validators: EmailValidator("EMAIL_ERROR")
})

return (
    <FormProvider controller={controller}>
        <ErrorConsumer field={email}>
            Error in E-mail field
        </ErrorConsumer>
        <ErrorConsumer field={email} error="REQUIRED">
            E-mail required
        </ErrorConsumer>
        <ErrorConsumer field={email} error="EMAIL_ERROR">
            E-mail validation failed
        </ErrorConsumer>
        <ErrorConsumer field={email}>
            {({ hasError, errorCode }) => !hasError ? null : (
                <div>
                    {errorCode}
                </div>
            )}
        </ErrorConsumer>
    </FormProvider>
)
```
##### PendingConsumer

Listening to controller pending status.
```tsx
// Example
// ... react component with useController hook
const { controller } = useController({
    fields: {
        email: Str(true)
    },
    validators: EmailValidator("EMAIL_ERROR"),
    submit: async () => {
        await delay(5000)
    }
})

return (
    <FormProvider controller={controller}>
        <PendingConsumer>
            Loading...
        </PendingConsumer>
        <PendingConsumer>
            {({ isPending }) => (
                <button disabled={isPending}>
                    submit
                </button>
            )}
        </PendingConsumer>
    </FormProvider>
)
```