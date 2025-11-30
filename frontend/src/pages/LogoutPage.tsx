import OperationStatus from "@/components/base/OperationStatus/OperationStatus";
import { AuthService } from "@/services/authorization_service";
import { useEffect, useState } from "react";

export default function LogoutPage() {
    const [componentState, setComponentState] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const logout = async () => {
            await AuthService.logout();
            setComponentState('success');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        };
        logout();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {componentState === 'loading' && <OperationStatus status={componentState} textPrimary="Wylogowywanie..." />}
            {componentState === 'success' && <OperationStatus status={componentState} textPrimary="Wylogowano pomyślnie" textSecondary="Zaraz zostaniesz przekierowany na stronę główną"/>}
            {componentState === 'error' && <OperationStatus status={componentState} textPrimary="Błąd podczas wylogowywania" textSecondary="Skontaktuj się z administratorem"/>}
        </div>
    );
}

