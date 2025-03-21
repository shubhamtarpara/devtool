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
9. ✅ Unit & Integration Testing API Routes
10. ✅ Advanced API Tips and Security

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

---

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

---

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

### 🔄 **Working with Query Parameters**

`/app/api/products/route.js`

```javascript
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = searchParams.get("limit") || 10;

  return Response.json({
    category,
    limit,
    message: `Fetching ${limit} products from ${category} category`,
  });
}
```

---

## 5. 🔄 **Middleware: Controlling Request Flow**

- Middleware intercepts requests before they hit the API route or page.
- Executes code before a request is completed.
- Can modify the response by rewriting, redirecting, or adding headers.

### 🎉 **Key Benefits:**

- Authentication/Authorization
- Logging, Caching, and Rate Limiting
- Custom Headers Injection
- Request/Response Modification

### 📍 **Middleware Location and Execution:**

- Place middleware in `/middleware.js` or `/middleware.ts` at the project root.
- Runs after `next.config.js` is parsed but before the request reaches the matching route.
- Executes on both client and server-side navigation.

### 🔄 **Middleware Flow:**

```
Client Request → next.config.js → middleware.js → Matching Route (API or Page)
```

### 🛠️ **Basic Middleware Structure:**

```javascript
import { NextResponse } from "next/server";

export function middleware(request) {
  // Your middleware logic here
  console.log("Middleware executed!");

  // Continue to the destination
  return NextResponse.next();

  // OR redirect
  // return NextResponse.redirect(new URL('/login', request.url));

  // OR rewrite
  // return NextResponse.rewrite(new URL('/rewritten-path', request.url));
}

// Optional: Configure which paths this middleware runs on
export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
```

---

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

### 🌐 **Example: CORS Middleware**

```javascript
import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
```

### 📊 **Example: Request Logging Middleware**

```javascript
import { NextResponse } from "next/server";

export function middleware(request) {
  const startTime = Date.now();
  const response = NextResponse.next();

  // Add response callback to log after completion
  response.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(`${request.method} ${request.url} - ${duration}ms`);
  });

  return response;
}
```

---

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

### 🔒 **Combining Middleware and API Routes for Security**

```javascript
// middleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "./utils/auth";

export function middleware(request) {
  // Skip authentication for public routes
  if (request.nextUrl.pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.headers.get("authorization")?.split(" ")[1];
  const user = token ? verifyToken(token) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Add user info to request headers for API routes to use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", user.id);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// API route that uses the user info from middleware
// app/api/protected/route.js
export async function GET(request) {
  const userId = request.headers.get("x-user-id");
  return Response.json({ message: `Protected data for user ${userId}` });
}
```

---

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

### 🔄 **Middleware vs. API Route Logic: When to Use Each**

| Middleware           | API Routes          |
| -------------------- | ------------------- |
| Request interception | Business logic      |
| Authentication       | Data processing     |
| Logging              | Database operations |
| Redirects            | Complex operations  |
| Headers manipulation | Response formatting |
| Rate limiting        | Resource handling   |

---

## 9. 🧪 **Unit & Integration Testing API Routes**

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

### 🧪 **Testing Middleware**

```javascript
// __tests__/middleware.test.js
import { middleware } from "../middleware";
import { NextResponse } from "next/server";

describe("Middleware", () => {
  it("should block unauthorized requests", async () => {
    const request = new Request("http://localhost:3000/api/user");
    const response = await middleware(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized access");
  });

  it("should allow authorized requests", async () => {
    const headers = new Headers();
    headers.set("authorization", "Bearer secretToken");

    const request = new Request("http://localhost:3000/api/user", {
      headers,
    });

    const nextMock = jest.spyOn(NextResponse, "next");
    await middleware(request);

    expect(nextMock).toHaveBeenCalled();
  });
});
```

---

## 10. 🔥 **Advanced API Tips and Security**

### 🛡️ **JWT Authentication Example**

```javascript
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

export function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}
```

### 📚 **Swagger API Documentation Setup**

- Use `swagger-jsdoc` and `swagger-ui-express` for automatic API documentation.
- Add Swagger annotations to define routes and responses.

### 🔄 **Advanced Middleware Patterns**

```javascript
// Chaining multiple middleware functions
import { NextResponse } from "next/server";

// Middleware composition helper
const composeMiddleware = (...middlewares) => {
  return async (request) => {
    let response = null;

    for (const middleware of middlewares) {
      response = await middleware(request);

      // If middleware returns a response, stop the chain
      if (response && response instanceof Response) {
        return response;
      }
    }

    return NextResponse.next();
  };
};

// Individual middleware functions
const logRequest = (request) => {
  console.log(`Request: ${request.method} ${request.url}`);
  // No response returned, continue to next middleware
};

const checkAuth = (request) => {
  const token = request.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // No response returned if auth passes, continue to next middleware
};

// Compose middleware
export const middleware = composeMiddleware(logRequest, checkAuth);
```

---

## 🎁 **Bonus: Utility Functions for API Helpers**

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
```

### 🔄 **Middleware Helpers**

```javascript
// utils/middleware-helpers.js
import { NextResponse } from "next/server";

export const middlewareHelpers = {
  // Add headers to response
  withHeaders: (headers = {}) => {
    return (request) => {
      const response = NextResponse.next();
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    };
  },

  // Redirect based on condition
  conditionalRedirect: (condition, destination) => {
    return (request) => {
      if (condition(request)) {
        return NextResponse.redirect(new URL(destination, request.url));
      }
      return NextResponse.next();
    };
  },
};
```

---

## 🎯 **Conclusion**

- API routes and middleware in Next.js 14 enable creating secure, scalable, and efficient APIs.
- Middleware provides powerful request interception capabilities for authentication, logging, and more.
- API routes offer a clean, file-based approach to building backend functionality.
- Combining middleware with API routes creates a robust architecture for web applications.
- Follow best practices and optimize API performance for production-ready applications.
