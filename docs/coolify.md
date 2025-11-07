# Coolify Deployment Issues & Solutions

## Common Problem: Gateway Error (502)

### Symptoms
- Website returns 502 Bad Gateway error
- Coolify shows no services running in the API
- Traefik proxy logs show routing errors

### Root Causes

This issue has occurred multiple times and typically stems from **three interconnected problems**:

#### 1. **Malformed Traefik Routing Rules in docker-compose.yaml**

**Problem:**
```yaml
labels:
  - 'traefik.http.routers.http-0-f00cg4gwgkwg4co4w4s0sos4.rule=Host(``) && PathPrefix(`quecargan.com`)'
```

The `Host()` matcher is empty and the domain is incorrectly placed in `PathPrefix()`.

**Solution:**
```yaml
labels:
  - 'traefik.http.routers.quecargan-http.rule=Host(`quecargan.com`)'
```

#### 2. **Missing Network Label**

**Problem:**
The docker-compose.yaml is missing the crucial network label that tells Traefik which Docker network to use for routing.

**Solution:**
Add this label to the service:
```yaml
labels:
  - traefik.docker.network=coolify
```

#### 3. **Stale Static Configuration Files (MOST COMMON)**

**Problem:**
When Coolify redeploys an application, it creates a new container with a new name (e.g., `f00cg4gwgkwg4co4w4s0sos4-171411037792`), but the static Traefik configuration file in `/traefik/dynamic/quecargan.yml` still points to the old container name (e.g., `f00cg4gwgkwg4co4w4s0sos4-184353960862`).

**Location:** Inside the `coolify-proxy` container at `/traefik/dynamic/quecargan.yml`

**What happens:**
- Traefik tries to route traffic to a container that no longer exists
- Returns 502 Bad Gateway
- No errors appear in recent logs because the configuration was "valid" at some point

**Solution:**
Update the static configuration file to point to the current container:

```bash
# 1. Find the current container name
docker ps --filter name=f00cg4gwgkwg4co4w4s0sos4

# 2. Update the static config
docker exec coolify-proxy vi /traefik/dynamic/quecargan.yml
# OR
docker exec coolify-proxy sh -c "cat > /traefik/dynamic/quecargan.yml << 'EOF'
http:
  services:
    qcargan-service:
      loadBalancer:
        servers:
          - url: \"http://[NEW_CONTAINER_NAME]:3000\"
EOF
"

# 3. Traefik will auto-reload (file watcher enabled)
```

## Diagnostic Commands

### Check Container Status
```bash
ssh root@167.88.44.175
docker ps -a --filter name=f00cg4gwgkwg4co4w4s0sos4
```

### Check Traefik Proxy Logs
```bash
docker logs --tail 50 coolify-proxy 2>&1 | grep -i quecargan
```

### Check Current Container Labels
```bash
docker inspect [CONTAINER_NAME] --format "{{json .Config.Labels}}" | python3 -m json.tool | grep traefik
```

### Test Container Directly (Bypass Traefik)
```bash
# Get container IP
docker network inspect coolify | grep -A5 [CONTAINER_NAME]

# Test direct connection
curl -I http://[CONTAINER_IP]:3000
```

### Check Static Configuration
```bash
docker exec coolify-proxy ls -la /traefik/dynamic/
docker exec coolify-proxy cat /traefik/dynamic/quecargan.yml
```

### Test from Coolify Network
```bash
docker run --rm --network=coolify curlimages/curl:latest curl -I http://[CONTAINER_NAME]:3000
```

## Prevention

### Option 1: Use Dynamic Labels Only
Instead of maintaining static configuration files, rely entirely on Docker labels in the docker-compose.yaml. This ensures configuration is always in sync with the current container.

### Option 2: Use Container Aliases
If using static configurations, use network aliases instead of container names:

```yaml
networks:
  coolify:
    aliases:
      - quecargan-app  # Static alias
```

Then in the static config:
```yaml
servers:
  - url: "http://quecargan-app:3000"  # Won't change
```

### Option 3: Post-Deployment Hook
Create a post-deployment script that automatically updates the static configuration file after each deployment.

## Quick Fix Checklist

When quecargan.com returns 502:

1. ✅ SSH into the server
2. ✅ Check if the container is running: `docker ps | grep f00cg4gwgkwg4co4w4s0sos4`
3. ✅ Test container directly: `curl -I http://[CONTAINER_IP]:3000`
4. ✅ If container works, check static config: `docker exec coolify-proxy cat /traefik/dynamic/quecargan.yml`
5. ✅ Update container name in static config if mismatched
6. ✅ Wait 2-3 seconds for Traefik to reload
7. ✅ Test: `curl -I https://quecargan.com`

## Files to Check

1. **Application docker-compose.yaml:**
   ```
   /data/coolify/applications/f00cg4gwgkwg4co4w4s0sos4/docker-compose.yaml
   ```

2. **Traefik static config:**
   ```
   /traefik/dynamic/quecargan.yml (inside coolify-proxy container)
   ```

## Server Details

- **Server IP:** 167.88.44.175
- **Username:** root
- **Coolify Proxy:** coolify-proxy (Traefik-based)
- **Network:** coolify
- **Application Port:** 3000 (Next.js)

## Related Documentation

This issue has been documented because it has occurred multiple times. The pattern is:
1. Deploy/redeploy application
2. Container gets new name
3. Static config becomes stale
4. Website returns 502

Always check the static configuration file first when experiencing gateway errors after a deployment.
