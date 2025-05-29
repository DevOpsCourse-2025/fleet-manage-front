export interface VehicleAssignmentPublic {  
  driverCurp: string;  
  assignedAt: string;  
  releasedAt: string;  
  status: string;  
  vin: string;  
  changedDriverCurp?: string;  
}  
  
export interface VehicleAssignment {  
  driverCurp: string;  
  vin: string;  
  status?: string;  
  changedDriverCurp?: string;  
  assignedAt: string;  
  releasedAt: string;
} 