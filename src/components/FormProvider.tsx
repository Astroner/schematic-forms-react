import React, { FC, ReactNode, useMemo, memo } from 'react';
import { FormController } from "@schematic-forms/core";

import { IFormContext, FormContext } from "../FormContext";

export interface IFormProvider extends IFormContext{
    controller: FormController<any, any>,
    children: ReactNode
}

const FormProvider: FC<IFormProvider> = props => {

    const value: IFormContext = useMemo<IFormContext>(
        () => ({
            controller: props.controller
        }),
        [props.controller]
    )

    return (
        <FormContext.Provider value={value}>
            {props.children}
        </FormContext.Provider>
    )
}

export default memo(FormProvider)