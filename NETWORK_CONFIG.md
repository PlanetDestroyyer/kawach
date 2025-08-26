# Network Configuration Explanation

## Why 0.0.0.0 Doesn't Work for Frontend API Requests

In computer networking, `0.0.0.0` has a special meaning:

1. **On the server side**: When a server binds to `0.0.0.0`, it means "listen on all available network interfaces". This is why your backend correctly uses `app.run(host='0.0.0.0', port=5000)`.

2. **On the client side**: When a client (like your mobile app) tries to connect to `0.0.0.0`, it doesn't know which actual server to connect to. It's not a valid destination IP address.

## Correct Network Configuration

For the mobile app to connect to your backend, it needs:
1. The actual IP address of the machine running the backend (e.g., `192.168.0.102`)
2. Both devices must be on the same network
3. The backend must be configured to accept external connections (which it is with `0.0.0.0`)

## Our Solution

We've implemented an automatic IP detection system that:
1. Tries common local IP patterns to find the backend
2. Allows manual configuration via environment variables
3. Caches successful connections for better performance

The `.env.example` file shows `0.0.0.0` as a placeholder, but in practice, you should replace it with your actual backend IP address.