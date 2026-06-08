CREATE TABLE IF NOT EXISTS guest_chat_usage (
  guest_session_id UUID PRIMARY KEY,
  message_count INTEGER NOT NULL DEFAULT 0 CHECK (message_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
