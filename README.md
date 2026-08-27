# AgroVision Evaluation Dashboard

A local React application to inspect and evaluate the Agentic Engine's raw diagnostic data (execution graphs, reasoning chains, token usage).

## Running Locally

By default, the dashboard proxies requests to a local Agentic Engine running on port `8100`.

```bash
npm install
npm start
```

## Connecting to a Deployed Environment

To connect the dashboard to your deployed backend (e.g. Cloud Run) while keeping all diagnostic features, you must configure it to hit the backend's passthrough `/chat/eval` endpoint.

1. Create a `.env` file in this directory based on `.env.example`.
2. Ensure your deployed backend has `EVAL_API_KEY` configured with the same secure string.

```env
REACT_APP_EVAL_API_URL=https://croptimum-backend-693388407533.asia-south1.run.app/chat/eval
REACT_APP_EVAL_API_KEY=your_secure_password
```
