import { createContext } from "react";
import { FormController } from "@schematic-forms/core";

export interface IFormContext {
    controller: FormController<any, any>
}

export const FormContext = createContext<IFormContext>({
    controller: new FormController({
        fields: {},
        submit: () => {
            console.error("MISS CONTEXT ERROR")
        }
    })
})