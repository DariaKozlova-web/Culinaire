import type { ErrorRequestHandler } from 'express';

type ErrorPayload = {
  message: string;
  code?: string;
};

function isMongoDuplicateKeyError(err: unknown): err is { code: number } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as Record<string, unknown>).code === 11000
  );
}

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log(err.stack);

// Mongo duplicate key (E11000)
  if (isMongoDuplicateKeyError(err)) {
    res.status(409).json({ message: "Slug already exists" });
    return;
  }

  if (err instanceof Error) {
    const payload: ErrorPayload = { message: err.message };

    if (err.cause) {
      const cause = err.cause as { status: number; code?: string };
      if (cause.code === 'ACCESS_TOKEN_EXPIRED') {
        res.setHeader(
          'WWW-Authenticate',
          'Bearer error="token_expired", error_description="the access token expired"'
        );
      }
      res.status(cause.status ?? 500).json(payload);
      return;
    }
    res.status(500).json(payload);
  }

  res.status(500).json({ message: 'Interal server error' });
  return;
};

export default errorHandler;
