import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

type RoleGuardProps = {
    allowedRoles: Role[];
    children: ReactNode;
};

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
    const { user } = useAuth();

    if (!user) return null;

    if (!allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}