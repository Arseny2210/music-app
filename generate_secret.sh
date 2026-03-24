#!/bin/bash

# Generate a secure random secret key for production
echo "Generated SECRET_KEY:"
python3 -c "import secrets; print(secrets.token_urlsafe(64))"

echo ""
echo "Add this to your .env file:"
echo "SECRET_KEY=<generated_key_above>"