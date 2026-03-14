// src/types/admin.types.ts
export interface AdminUserDto {
    userId: string;
    userEmail: string;
    userName: string;
    fullName?: string; // Kept for backward compatibility if needed
    userRoles: string; // e.g., "Admin,TheaterManager"
    accountStatus: number; // 1: Active, 2: Locked, 3: Banned...
    registerMethod: number;
}

export interface ScheduleJobDto {
    cronExpression: string;
    jobType: string;
    lastExecutionTime: string | null;
    nextExecutionTime: string | null;
    stateName: string;
    jobArguments: any[];
}

export interface RoleDto {
    roleId: string;
    roleName: string;
}
