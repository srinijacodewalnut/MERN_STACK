/** The data contract used by both the browser and the API. */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface HealthResponse {
  status: "ok";
  runtime: string;
}

export interface ApiError {
  error: string;
}
