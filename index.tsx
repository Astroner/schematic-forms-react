import React, { FC } from "react";
import { render } from "react-dom";
import { FormProvider, useController, useForm, ValueConsumer, FieldConsumer, PendingConsumer, ErrorConsumer } from "./src";
import { Str, EmailValidator, Num, Obj, Enum, Arr, Mix } from "@schematic-forms/core";

const delay = (num: number) => new Promise<void>(resolve => {
    setTimeout(() => {
        resolve()
    }, num);
})

const Input: FC<{ name: string }> = ({ name }) => {
    const [value, setValue, error] = useForm(name, "");

    return (
        <>
            {error}
            <input value={value} onChange={e => setValue(e.target.value)} />
        </>
    )
}

const App: FC<{}> = () => {

    const { controller, submit } = useController({
        fields: {
            email: Str(true),
            counter: Num(true),
            obj: Obj({
                label: Str(true),
                value: Str(true)
            }),
            enum: Enum<["RQ", "RS"]>(["RQ", "RS"]),
            arr: Arr(Str(true)),
            mix: Mix([
                Str(true),
                Num(true),
                Obj({
                    value: Str(true)
                })
            ])
        },
        validators: {
            email: EmailValidator()
        },
        submit: async (data) => {
            await delay(2000);
            console.log(data.mix)
            return
        }
    })
    
    return (
        <FormProvider controller={controller} >
            <Input name="email" />
            <FieldConsumer initialValue="" field="counter">
                {({ value, setValue }) => (
                    <input value={value} onChange={e => setValue(e.target.value)} />
                )}
            </FieldConsumer>
            <ValueConsumer field="counter">
                Touched
            </ValueConsumer>
            <button onClick={submit} >Click me</button>
            <PendingConsumer>
                LOADING...
            </PendingConsumer>
            <ErrorConsumer field="email">
                {({ hasError, errorCode }) => !hasError ? null : (
                    <div>
                        {errorCode}
                    </div>
                )}
            </ErrorConsumer>
        </FormProvider>
    )
}

const a = render(<App />, document.getElementById("root"))
