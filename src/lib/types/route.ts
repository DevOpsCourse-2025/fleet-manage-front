
export type Route = {
  routeName: string;
  vehicleVin: string;
  travelDate: string;
  creationDate: string;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  name?: string;
  description?: string;
  comment?: string;
};

export type RoutePublic = {
  routeName: string;
  vehicleVin: string;
  travelDate: string;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  creationDate?: string;
  name?: string;
  description?: string;
  comment?: string;
};
