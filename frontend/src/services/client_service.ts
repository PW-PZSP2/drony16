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
  status?: "Zakończone" | "W trakcie" | "Zrealizowane" | "Złożone";
  selectedOperator?: string;
  rating?: number;
  completedDate?: string;
}

interface Applicant {
  id: number;
  email: string;
  name: string;
  phone_number: string;
  localisation: string;
  area: number;
}

interface RatingData {
  orderId: number;
  rating: number;
  comment?: string;
}

const API_URL = "http://localhost:8080";

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
      email: apiApplicant.email,
      phone_number: apiApplicant.phone_number,
      localisation: apiApplicant.localisation,
      area: apiApplicant.area,
    }),
  );

  return applicants;
}

async function fetch_completed_orders(): Promise<Order[]> {
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
      score: number;
    }) => ({
      id: apiOrder.order_id,
      title: apiOrder.name,
      service: apiOrder.services[0]?.service_name || "Unknown",
      description: apiOrder.description,
      location: apiOrder.location,
      deadline: apiOrder.deadline,
      deadlineType: apiOrder.completion_date ? "completion" : "flight",
      applicants: apiOrder.interested_operators.length,
      rating: apiOrder.score,
      status:
        apiOrder.status === "W trakcie"
          ? "in-progress"
          : apiOrder.status === "Zakończone"
            ? "completed"
            : "pending",
    }),
  );

  return completedOrders;
}

async function rate_order(
  ratingData: RatingData,
): Promise<{ success: boolean; message?: string }> {
  const mapped_request = {
    score: ratingData.rating,
    opinion: ratingData.comment || "",
  };

  const response = await fetch(
    `${API_URL}/orders/${ratingData.orderId}/opinion`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      credentials: "include",
      body: JSON.stringify(mapped_request),
    },
  );

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to submit rating",
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to select operator",
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
