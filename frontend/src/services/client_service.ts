import { backendClient } from "@/utils/backend_client";

// Types for the service
interface OrderData {
  title: string;
  service: string;
  description: string;
  location: string;
  deadline: string;
  deadlineType: "flight" | "completion";
}

interface Order {
  id: number;
  title: string;
  service: string;
  description: string;
  location: string;
  deadline: string;
  deadlineType: "flight" | "completion";
  applicants: number;
  status?: "pending" | "in-progress" | "completed" | "cancelled";
  selectedOperator?: string;
  rating?: number;
  completedDate?: string;
}

interface Applicant {
  id: number;
  name: string;
  rating: number;
  completedJobs: number;
  description: string;
  equipment: string[];
  price?: number;
  estimatedDuration?: string;
}

interface RatingData {
  orderId: number;
  rating: number;
  comment?: string;
}

const API_DELAY = 1000;
const API_URL = "http://localhost:8080";

const mockDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function create_order(
  orderData: OrderData,
): Promise<{ success: boolean; orderId?: number; message?: string }> {
  const mapped_request = {
    name: orderData.title,
    deadline: orderData.deadline,
    location: orderData.location,
    description: orderData.description,
    completion_date: orderData.deadlineType == "completion",
    raid_date: orderData.deadlineType == "flight",
    services: [
      {
        service_name: orderData.service,
        parameters: {},
      },
    ],
  };

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
    credentials: "include",
    body: JSON.stringify(mapped_request),
  });

  if (!response.ok) {
    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

async function fetch_current_orders(): Promise<Order[]> {
  await mockDelay(API_DELAY);

  const response = await fetch(`${API_URL}/orders/client/pending`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
    credentials: "include",
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  const pendingOrders: Order[] = data.map(
    (apiOrder: {
      name: string;
      deadline: string;
      location: string;
      description: string;
      completion_date: boolean;
      raid_date: boolean;
      order_id: number;
      services: Array<{
        service_name: string;
        parameters: Record<string, unknown>;
      }>;
      client_id: number;
      operator_id: number;
      creation_date: string;
      latitude: number;
      longitude: number;
      interested_operators: unknown[];
      status: string;
      has_applied: boolean;
    }) => ({
      id: apiOrder.order_id,
      title: apiOrder.name,
      service: apiOrder.services[0]?.service_name || "Unknown",
      description: apiOrder.description,
      location: apiOrder.location,
      deadline: apiOrder.deadline,
      deadlineType: apiOrder.completion_date ? "completion" : "flight",
      applicants: apiOrder.interested_operators.length,
      status:
        (apiOrder.status as
          | "pending"
          | "in-progress"
          | "completed"
          | "cancelled") || "pending",
    }),
  );

  return pendingOrders;
}

async function fetch_order_applicants(orderId?: number): Promise<Applicant[]> {
  await mockDelay(API_DELAY);

  const response = await fetch(`${API_URL}/orders/${orderId}/candidates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
    credentials: "include",
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  const applicants: Applicant[] = data.map(
    (apiApplicant: {
      email: string;
      user_id: number;
      user_name: string;
      is_blocked: string;
      roles: string[];
      phone_number: string;
      creation_date: string;
      localisation: string;
      latitude: number;
      longitude: number;
      area: number;
    }) => ({
      id: apiApplicant.user_id,
      name: apiApplicant.user_name,
      rating: 0,
      completedJobs: 0,
      description: apiApplicant.localisation,
      equipment: [],
    }),
  );

  return applicants;
}

async function fetch_completed_orders(): Promise<Order[]> {
  await mockDelay(API_DELAY);

  const response = await fetch(`${API_URL}/orders/client/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
    credentials: "include",
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  const completedOrders: Order[] = data.map(
    (apiOrder: {
      name: string;
      deadline: string;
      location: string;
      description: string;
      completion_date: boolean;
      raid_date: boolean;
      order_id: number;
      services: Array<{
        service_name: string;
        parameters: Record<string, unknown>;
      }>;
      client_id: number;
      operator_id: number;
      creation_date: string;
      latitude: number;
      longitude: number;
      interested_operators: unknown[];
      status: string;
      has_applied: boolean;
    }) => ({
      id: apiOrder.order_id,
      title: apiOrder.name,
      service: apiOrder.services[0]?.service_name || "Unknown",
      description: apiOrder.description,
      location: apiOrder.location,
      deadline: apiOrder.deadline,
      deadlineType: apiOrder.completion_date ? "completion" : "flight",
      applicants: apiOrder.interested_operators.length,
      status:
        (apiOrder.status as
          | "pending"
          | "in-progress"
          | "completed"
          | "cancelled") || "completed",
    }),
  );

  return completedOrders;
}

async function rate_order(
  ratingData: RatingData,
): Promise<{ success: boolean; message?: string }> {
  await mockDelay(API_DELAY);

  if (
    !ratingData.orderId ||
    !ratingData.rating ||
    ratingData.rating < 1 ||
    ratingData.rating > 5
  ) {
    return {
      success: false,
      message: "Invalid rating data",
    };
  }

  return {
    success: true,
    message: "Rating submitted successfully",
  };
}

async function select_operator(
  orderId: number,
  operatorId: number,
): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/select/${operatorId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      credentials: "include",
    },
  );
  console.log(response);

  if (!orderId || !operatorId) {
    return {
      success: false,
      message: "Order ID and Operator ID are required",
    };
  }

  return {
    success: true,
    message: "Operator selected successfully",
  };
}

export {
  create_order,
  fetch_current_orders,
  fetch_order_applicants,
  fetch_completed_orders,
  rate_order,
  select_operator,
  type OrderData,
  type Order,
  type Applicant,
  type RatingData,
};
