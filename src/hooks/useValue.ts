import { FormController } from "@schematic-forms/core";
import { useState, useEffect } from "react";

/**
 * 
 * @param controller form controller
 * @param name field name
 * 
 * @returns field value
 */
const useValue = <
    Controller extends FormController<any, any>,
    K extends Parameters<Controller["set"]>[0]
>(
    controller: Controller,
    name: K
): ReturnType<Controller["getValues"]>[K] => {

    const [state, setState] = useState<ReturnType<Controller["getValues"]>[K]>(controller.getValues()[name])

    useEffect(() => {
        const sub = controller.subscribe("values", (values) => {
            setState(values[name])
        })
        return () => {
            sub.unsubscribe()
        }
    }, [controller, name])

    return state
}

export default useValue;