# Mock Server for IPAM API

## How to Use

1. Install json-server: `npm install -g json-server`
2. Run the server: `json-server --watch server/db.json --routes server/routes.json --port 3000`
3. Access the API at `http://localhost:3000`

## Notes
- This mock server is for development and testing purposes only
- Data resets to initial state with each restart
