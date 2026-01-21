const API_URL = "http://localhost:8080";

export interface ServiceRequest {
  service_name: string;
  parameters: Record<string, string>;
}

export interface Order {
  order_id: number;
  name: string;
  deadline: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  services: ServiceRequest[];
  description: string;
  completion_date: boolean;
  raid_date: boolean;
  client_id: number;
  operator_id: number | null;
  creation_date: string;
  has_applied?: boolean; // Added field
  state: string;
  client_email?: string;
  client_phone?: string;
}

export interface Service {
  service_id: number;
  name: string;
}

export interface Attachment {
  attachment_id: number;
  name: string;
  description: string | null;
  file_path: string;
}

export interface OperatorAverage {
  operator_id: number;
  average_score: number | null;
}

async function getOperatorAverage(
  operatorId: number,
): Promise<OperatorAverage> {
  const response = await fetch(`${API_URL}/operators/average/${operatorId}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch average score");
  return response.json();
}

async function updateLocation(localisation: string): Promise<void> {
  const response = await fetch(`${API_URL}/operators/me/location`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ localisation }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update location");
}

async function updateArea(area: number): Promise<void> {
  const response = await fetch(`${API_URL}/operators/me/area`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ area }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update area");
}

async function getAllServices(): Promise<Service[]> {
  const response = await fetch(`${API_URL}/operators/services`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch services");
  return response.json();
}

async function getMyServices(): Promise<{ services: Service[] }> {
  const response = await fetch(`${API_URL}/operators/me/services`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch my services");
  return response.json();
}

async function updateMyServices(services: number[]): Promise<void> {
  // Backend expects a list of IDs or names. We'll send IDs.
  // Body: { services: [...] }
  const response = await fetch(`${API_URL}/operators/me/services`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ services }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update services");
}

async function getMyAttachments(): Promise<{ attachments: Attachment[] }> {
  const response = await fetch(`${API_URL}/operators/me/attachments`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch attachments");
  return response.json();
}

async function addAttachment(
  name: string,
  description: string,
  fileUrl: string,
): Promise<Attachment> {
  const formData = new FormData();
  formData.append("name", name);
  if (description) formData.append("description", description);
  formData.append("file_url", fileUrl);

  const response = await fetch(`${API_URL}/operators/me/add_attachments`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to add attachment");
  return response.json();
}

async function removeAttachment(attachmentId: number): Promise<void> {
  const response = await fetch(
    `${API_URL}/operators/me/remove_attachments/${attachmentId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  if (!response.ok) throw new Error("Failed to remove attachment");
}

async function getMatchedOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders/matched`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch matched orders");
  }

  return response.json();
}

async function applyForOrder(orderId: number): Promise<void> {
  const response = await fetch(`${API_URL}/orders/${orderId}/interest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to apply for order");
  }
}

async function getAssignedOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders/assigned`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch assigned orders");
  }

  return response.json();
}

async function getOrderHistory(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders/history`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch order history");
  }
  return response.json();
}

async function completeOrder(orderId: number): Promise<void> {
  const response = await fetch(`${API_URL}/orders/${orderId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to complete order");
  }
}

export const OperatorService = {
  getOperatorAverage,
  updateLocation,
  updateArea,
  getAllServices,
  getMyServices,
  updateMyServices,
  getMyAttachments,
  addAttachment,
  removeAttachment,
  getMatchedOrders,
  applyForOrder,
  getAssignedOrders,
  getOrderHistory,
  completeOrder,
};
