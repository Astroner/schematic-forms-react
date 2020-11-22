import { FormController } from "@schematic-forms/core";
import { useEffect, useState } from "react";

/**
 * 
 * @param controller form controller
 * 
 * @returns isPending status
 */
const usePending = <
    Controller extends FormController<any, any>
>(
    controller: Controller
): { isPending: boolean } => {
    const [isPending, setIsPending] = useState(controller.isPending());

    useEffect(() => {
        const sub = controller.subscribe("pending", ({ pending }) => {
            setIsPending(pending)
        })

        return () => sub.unsubscribe()
    }, [controller])

    return { isPending }
}

export default usePending;