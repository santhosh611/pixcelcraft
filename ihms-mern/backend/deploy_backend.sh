#!/bin/bash
echo "Checking for vercel..."

echo "Pushing code to GitHub..."
git add .
git commit -m "Configure backend for Vercel and add MongoDB"
git push

echo "Extracting env variables and deploying to Vercel..."
# We will create an expect script to handle the initial deploy
cat << 'EOF' > deploy_backend.exp
#!/usr/bin/expect -f
set timeout 120
spawn npx --yes vercel --prod
expect {
    "Set up and deploy" { send "y\r"; exp_continue }
    "Which scope do you want to deploy to" { send "\r"; exp_continue }
    "Link to existing project" { send "n\r"; exp_continue }
    "What's your project's name" { send "ihms-backend\r"; exp_continue }
    "In which directory is your code located" { send "\r"; exp_continue }
    "Want to override the settings" { send "n\r"; exp_continue }
    eof { }
}
EOF
chmod +x deploy_backend.exp
./deploy_backend.exp

# Add env vars
cat .env | grep -v '^#' | while read line; do
  if [ -n "$line" ]; then
    key=$(echo "$line" | cut -d '=' -f 1)
    value=$(echo "$line" | cut -d '=' -f 2-)
    # The vercel env add command might prompt "Environment: Production, Preview, Development". Let's use expect for it too
    cat << EOF2 > add_env_$key.exp
#!/usr/bin/expect -f
set timeout 10
spawn npx --yes vercel env add $key production
expect {
    "What's the value of $key" { send "$value\r"; exp_continue }
    eof { }
}
EOF2
    chmod +x add_env_$key.exp
    ./add_env_$key.exp
    rm add_env_$key.exp
  fi
done

echo "Redeploying to apply environment variables..."
npx vercel --prod --yes
