# 🚀 Mastering API Routes and Middleware in Next.js 14

## 🎯 **Objective**

This talk will provide a deep dive into mastering API routes and middleware in **Next.js 14**, helping frontend developers build robust and secure APIs seamlessly.

---

## 📚 **Agenda**

1. ✅ Introduction to API Routes in Next.js 14
2. ✅ File-Based Routing for API Endpoints
3. ✅ Creating RESTful API Routes
4. ✅ Handling Query Parameters and Dynamic Routes
5. ✅ Middleware: Controlling Request Flow
6. ✅ Practical Use Cases for Middleware
7. ✅ Error Handling and Securing API Routes
8. ✅ Best Practices and Performance Optimization
9. ✅ Live Demo and Q&A

---

## 1. 🚩 **Introduction to API Routes in Next.js 14**

- API routes enable building a **backend within a Next.js project**.
- Located inside the `/app/api` directory.
- Use serverless functions to handle incoming HTTP requests.

### ✅ **Key Changes in Next.js 14:**

- Fully supports **app router** with API routes.
- Middleware now works with edge runtime for improved performance.
- Supports `GET`, `POST`, `PUT`, `DELETE` methods natively.

---

## 2. 📂 **File-Based Routing for API Endpoints**

- API routes follow the same file-based system as pages.
- All API routes are placed under `/app/api`.
- File name defines the endpoint.

### 📚 **Basic Folder Structure:**

```
/app
├── /api
│   ├── /hello
│   │   └── route.js
│   ├── /user
│   │   └── route.js
│   └── /product
│       └── route.js
└── /page.js
```

### 🔥 **Example: Basic API Route**

`/app/api/hello/route.js`

```javascript
export async function GET(request) {
  return Response.json({ message: "Hello, Next.js 14 API!" });
}
```

## 3. ⚡ **Creating RESTful API Routes**

- Each route can handle multiple HTTP methods (GET, POST, PUT, DELETE).
- Named `route.js` or `route.ts` in the respective folder.

### ✨ **Example: CRUD Operations for User**

`/app/api/user/route.js`

```javascript
export async function GET(request) {
  return Response.json({ users: ["John", "Jane", "Doe"] });
}

export async function POST(request) {
  const body = await request.json();
  return Response.json({ message: `User ${body.name} added!` });
}

export async function PUT(request) {
  const body = await request.json();
  return Response.json({ message: `User ${body.id} updated!` });
}

export async function DELETE(request) {
  const { id } = await request.json();
  return Response.json({ message: `User with ID ${id} deleted.` });
}
```

## 4. 🔍 **Handling Query Parameters and Dynamic Routes**

- Use dynamic segments for parameters.
- Define dynamic routes using square brackets `[]`.

### 🎯 **Example: Fetch User by ID**

`/app/api/user/[id]/route.js`

```javascript
export async function GET(request, { params }) {
  const { id } = params;
  return Response.json({ message: `User ID: ${id}` });
}
```

## 5. 🔄 **Middleware: Controlling Request Flow**

- Middleware intercepts requests before they hit the API route.

### 🎉 **Key Benefits:**

- Authentication/Authorization
- Logging, Caching, and Rate Limiting
- Custom Headers Injection

### 📍 **Middleware Location:**

- Place middleware in `/middleware.js` or `/middleware.ts` at the project root.

## 6. 🛡️ **Practical Use Cases for Middleware**

### ✅ **Example: Basic Authentication Middleware**

`/middleware.js`

```javascript
import { NextResponse } from "next/server";

export function middleware(request) {
  const authToken = request.headers.get("authorization");

  if (!authToken || authToken !== "Bearer secretToken") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  return NextResponse.next();
}

// Apply to specific routes
export const config = {
  matcher: ["/api/user/:path*"],
};
```

## 7. 🚨 **Error Handling and Securing API Routes**

- Use try-catch blocks to handle errors gracefully.
- Return appropriate HTTP status codes.

### ❗ **Example: Enhanced Error Handling**

```javascript
export async function GET(request) {
  try {
    // Simulate DB fetch
    const data = await fetchUserData();
    return Response.json({ data });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
```

## 8. 🎯 **Best Practices and Performance Optimization**

### 🚀 **Performance Tips**

- Use Edge Middleware for low-latency response
- Cache frequently accessed endpoints
- Rate limit API calls to prevent abuse
- Use `next/server` to leverage Edge Runtime

### 🔒 **Security Best Practices**

- Implement CORS policies
- Use HTTPS for all API endpoints
- Validate and sanitize all input data
- Implement rate limiting

### ⚡ **Example: Rate Limiting Middleware**

```javascript
import { NextResponse } from "next/server";

const rateLimit = new Map();

export function middleware(request) {
  const ip = request.headers.get("x-forwarded-for");
  const now = Date.now();
  const timeFrame = 60 * 1000; // 1 minute
  const maxRequests = 60; // requests per minute

  const requestLog = rateLimit.get(ip) || [];
  const recentRequests = requestLog.filter((time) => now - time < timeFrame);

  if (recentRequests.length >= maxRequests) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);

  return NextResponse.next();
}
```

## 9. 🧪 **Testing API Routes**

### 📝 **Unit Testing Example**

```javascript
// __tests__/api/user.test.js
import { GET, POST } from "@/app/api/user/route";

describe("User API", () => {
  it("should return users list", async () => {
    const response = await GET();
    const data = await response.json();
    expect(data.users).toBeInstanceOf(Array);
  });

  it("should create new user", async () => {
    const request = new Request("http://localhost:3000/api/user", {
      method: "POST",
      body: JSON.stringify({ name: "Test User" }),
    });
    const response = await POST(request);
    const data = await response.json();
    expect(data.message).toContain("Test User");
  });
});
```

## 10. 🔍 **Troubleshooting Common Issues**

### ❌ **Common Errors and Solutions**

1. **CORS Issues**

```javascript
// middleware.js
export function middleware(request) {
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  return response;
}
```

2. **Request Body Parsing**

```javascript
export async function POST(request) {
  try {
    const body = await request.json();
  } catch (error) {
    return Response.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }
}
```

3. **Environment Variables**

```javascript
// .env.local
API_KEY = your_secret_key;

// route.js
export async function GET() {
  if (!process.env.API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }
}
```

## 🎁 **Bonus: Advanced Tips**

### 🔥 **API Response Helpers**

```javascript
// utils/api-helpers.js
export const apiResponse = {
  success: (data, status = 200) => {
    return Response.json(data, { status });
  },
  error: (message, status = 400) => {
    return Response.json({ error: message }, { status });
  },
};

// Usage in route.js
import { apiResponse } from "@/utils/api-helpers";

export async function GET() {
  try {
    const data = await fetchData();
    return apiResponse.success(data);
  } catch (error) {
    return apiResponse.error("Failed to fetch data");
  }
}
```

### 🛠️ **Development Tips**

- Use TypeScript for better type safety and IDE support
- Implement proper logging for debugging
- Use Postman or similar tools for API testing
- Consider implementing API documentation using Swagger/OpenAPI
