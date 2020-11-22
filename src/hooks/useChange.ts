import { FormController } from "@schematic-forms/core";
import { useCallback } from "react";

/**
 * 
 * @param controller form controller
 * @param name field name
 * 
 * @returns setter function
 */
const useChange = <
    Controller extends FormController<any, any>, 
    K extends Parameters<Controller["set"]>[0]
>(
    controller: Controller,
    name: K
): ((next: ReturnType<Controller["getValues"]>[K]) => void) => {

    const change = useCallback((next: ReturnType<Controller["getValues"]>[K]) => {
        controller.set(name, next)
    }, [controller, name])

    return change
}

export default useChange;