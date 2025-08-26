// Decoradores para servicios de consumo de backend
import { BACKEND_BASE_URL } from "./config";

/**
 * Decorador para métodos HTTP GET
 * @param endpoint Endpoint relativo al backend
 */
export function GET(endpoint: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = async function (...args: any[]) {
      let url = endpoint;
      // Reemplazo de parámetros dinámicos en endpoint
      if (/:\w+/.test(endpoint)) {
        url = endpoint.replace(/:(\w+)/g, (_, key) => args.shift());
      }
      url = `${BACKEND_BASE_URL}${url}`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      return response.json();
    };
    return descriptor;
  };
}

/**
 * Decorador para métodos HTTP POST
 * @param endpoint Endpoint relativo al backend
 */
export function POST(endpoint: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = async function (body: any, ...args: any[]) {
      let url = endpoint;
      if (/:\w+/.test(endpoint)) {
        url = endpoint.replace(/:(\w+)/g, (_, key) => args.shift());
      }
      url = `${BACKEND_BASE_URL}${url}`;
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return response.json();
    };
    return descriptor;
  };
}

export function PUT(endpoint: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = async function (...args: any[]) {
      let url = endpoint;
      let body = args[args.length - 1];
      if (typeof body === "object" && !Array.isArray(body)) {
        args.pop();
      } else {
        body = undefined;
      }
      if (/:\w+/.test(endpoint)) {
        url = endpoint.replace(/:(\w+)/g, (_, key) => args.shift());
      }
      url = `${BACKEND_BASE_URL}${url}`;
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      return response.json();
    };
    return descriptor;
  };
}

export function DELETE(endpoint: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = async function (...args: any[]) {
      let url = endpoint;
      if (/:\w+/.test(endpoint)) {
        url = endpoint.replace(/:(\w+)/g, (_, key) => args.shift());
      }
      url = `${BACKEND_BASE_URL}${url}`;
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      return response.json();
    };
    return descriptor;
  };
}
