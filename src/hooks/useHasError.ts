import { FormController } from "@schematic-forms/core";
import { useState, useEffect } from "react";

/**
 * 
 * @param controller form controller;
 * 
 * @returns boolean flag of errors existings
 * @description use this hook if u want to watch on errors existing
 */
const useHasError = (
    controller: FormController<any, any> | null
): boolean => {
    const [hasErrors, setHasErrors] = useState(false);
    
    useEffect(() => {
        if(!controller) return
        const sub = controller.subscribe("errors", (errors) => {
            setHasErrors(Object.keys(errors).length > 0)
        })
        return () => {
            sub.unsubscribe();
        }
    }, [controller])

    return hasErrors;
}

export default useHasError