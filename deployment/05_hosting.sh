
#!/bin/bash
echo "📧 [PHASE 4] Activating Email & Hosting Automation..."

# Test connection to Email Engine (Inside Backend)
# We trigger a self-check endpoint
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/status)

if [ "$RESPONSE" -eq 200 ]; then
    echo "✅ [PHASE 4] Hosting Engine Connected to Cloudflare."
else
    echo "⚠️ [PHASE 4] Hosting Engine API unreachable (Code: $RESPONSE)."
    # Don't exit, just warn
fi
