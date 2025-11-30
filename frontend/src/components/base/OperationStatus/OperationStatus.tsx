import { Spinner } from "@/components/ui/spinner";
import { CircleCheck, CircleX } from "lucide-react";

interface OperationStatusProps {
    id?: string;
    className?: string;
    status: 'loading' | 'success' | 'error';
    textPrimary?: string;
    textSecondary?: string;
}

export default function OperationStatus(props: OperationStatusProps) {
    return (
        <div className="flex flex-col justify-center items-center" id={props.id}>
            {props.status === 'loading' && <Spinner className="size-12" />}
            {props.status === 'success' && <CircleCheck className="size-12 text-green-500" />}
            {props.status === 'error' && <CircleX className="size-12 text-red-500" />}
            {props.textPrimary && <p className="mt-4 text-center text-muted-foreground">{props.textPrimary}</p>}
            {props.textSecondary && <p className="mt-2 text-center text-sm text-muted-foreground">{props.textSecondary}</p>}
        </div>
    )
}