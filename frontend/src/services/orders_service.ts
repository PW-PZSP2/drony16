const API_URL = "http://localhost:8080";

export interface ServiceRequest {
  service_name: string;
  parameters: Record<string, any>;
}

export interface OrderResponse {
  order_id: number;
  name: string;
  deadline: string; // datetime string
  location: string;
  description: string;
  completion_date: boolean;
  raid_date: boolean;
  client_id: number;
  operator_id: number | null;
  creation_date: string;
  latitude?: number;
  longitude?: number;
  services: ServiceRequest[];
}

async function getMatchedOrders(): Promise<OrderResponse[]> {
  try {
    const response = await fetch(`${API_URL}/orders/matched`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for auth
    });

    if (!response.ok) {
      throw new Error("Failed to fetch matched orders");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching matched orders:", error);
    return [];
  }
}

export const OrdersService = {
  getMatchedOrders,
};
