import { useState, useCallback } from "react"
import { FormController } from "@schematic-forms/core"
import { ControllerConfig } from "@schematic-forms/core/lib/types"
import { All } from "@schematic-forms/core/lib/FieldTypes";

/**
 * 
 * @param config config for FormController
 * 
 * @returns {controller: FormController, submit: VoidFunction }
 * @description creates controller for FormLayout
 */
const useController = <FieldTypes extends { [key: string]: All }, ArgTypes extends any[]=void[]>(
    config: ControllerConfig<FieldTypes, ArgTypes>
): {
    controller: FormController<FieldTypes, ArgTypes>, 
    submit: (...arg: ArgTypes) => void
} => {
    const [controller] = useState(new FormController<FieldTypes, ArgTypes>(config));
    const submit = useCallback((...arg: ArgTypes) => controller.submit(...arg), [controller])


    return { controller, submit }
}

export default useController