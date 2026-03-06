// src/types/admin.types.ts
export interface AdminUserDto {
    userId: string;
    userEmail: string;
    fullName: string;
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
