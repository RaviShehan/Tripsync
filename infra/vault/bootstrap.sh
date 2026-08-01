# ============================================================================
# TripSync - HashiCorp Vault Structure
# Path: secret/data/tripsync/*  (KV v2 engine)
#
# Bootstrap (dev mode, for demo purposes only):
#   export VAULT_ADDR=http://localhost:8200
#   export VAULT_TOKEN=tripsync-root-token
#   vault kv put secret/tripsync/database url=... user=... password=...
#
# For production, enable TLS, seal/unseal via unseal keys + auto-unseal (KMS/HSM).
# ============================================================================

# Enable KV v2 engine
vault secrets enable -path=secret kv-v2

# --- Database credentials ---
vault kv put secret/tripsync/database \
  url="jdbc:postgresql://db:5432/tripsync_db" \
  username="postgres" \
  password="TripsyncR00t!Secret"

# --- Redis ---
vault kv put secret/tripsync/redis \
  host="redis" \
  port="6379" \
  password="TripsyncRedis!Secret"

# --- Kafka ---
vault kv put secret/tripsync/kafka \
  bootstrapServers="kafka:9092" \
  saslUsername="tripsync" \
  saslPassword="TripsyncKafka!Secret"

# --- JWT signing ---
vault kv put secret/tripsync/jwt \
  secret="change-me-please-32-characters-minimum" \
  expiresIn="15m"

# --- OAuth2 / OIDC ---
vault kv put secret/tripsync/oauth \
  clientId="tripsync-web" \
  clientSecret="tripsync-oauth2-client-secret" \
  issuerUri="https://auth.tripsync.local/realms/tripsync"

# --- Payments (PCI data must be externalized; here only provider keys) ---
vault kv put secret/tripsync/payments \
  provider="stripe" \
  apiKey="sk_test_change_me" \
  webhookSecret="whsec_change_me"
