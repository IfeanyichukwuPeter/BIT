# 🚀 Deployment Guide

This guide covers deploying the BIT Children Ministry website to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass (`pnpm test`)
- [ ] Environment variables are configured
- [ ] Admin credentials are changed from defaults
- [ ] Database/storage is backed up
- [ ] HTTPS/SSL certificate is ready
- [ ] Domain DNS is configured

---

## 🌐 Deployment Options

### Option 1: Traditional VPS (Recommended for beginners)

**Providers:** DigitalOcean, Linode, AWS EC2, Google Cloud

**Steps:**

1. **Provision a server**
   ```bash
   # Ubuntu 22.04 LTS recommended
   # Minimum: 1GB RAM, 1 vCPU
   ```

2. **Connect via SSH**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install pnpm**
   ```bash
   npm install -g pnpm
   ```

5. **Clone repository**
   ```bash
   git clone <your-repo-url>
   cd BIT
   ```

6. **Install dependencies**
   ```bash
   pnpm install --prod
   ```

7. **Set environment variables**
   ```bash
   nano .env
   # Set production values
   PORT=3000
   NODE_ENV=production
   ADMIN_USERNAME=your-secure-username
   ADMIN_PASSWORD=your-strong-password
   ```

8. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name bit-website
   pm2 save
   pm2 startup
   ```

9. **Set up Nginx as reverse proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/bit
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/bit /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Set up SSL with Let's Encrypt**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

---

### Option 2: Platform as a Service (PaaS)

#### Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and create app**
   ```bash
   heroku login
   heroku create bit-children-ministry
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set ADMIN_USERNAME=admin
   heroku config:set ADMIN_PASSWORD=your-password
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

#### Render.com

1. Connect your GitHub repository
2. Create a new Web Service
3. Set build command: `pnpm install`
4. Set start command: `pnpm start`
5. Add environment variables in dashboard

#### Railway.app

1. Connect repository
2. Configure environment variables
3. Deploy automatically on push

---

### Option 3: Serverless (For high traffic)

#### Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure** (add `vercel.json`):
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server/server.js"
       }
     ]
   }
   ```

---

## 🔒 Production Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong passwords (16+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Backup data regularly
- [ ] Use environment variables (never commit secrets)
- [ ] Enable CORS only for trusted domains
- [ ] Add security headers

### Example Security Headers (Nginx)

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

---

## 📊 Monitoring

### PM2 Monitoring

```bash
pm2 monit
pm2 logs bit-website
pm2 status
```

### Log Management

```bash
# View logs
pm2 logs

# Clear logs
pm2 flush

# Setup log rotation
pm2 install pm2-logrotate
```

---

## 🔄 Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '20'
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Run tests
      run: pnpm test
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/BIT
          git pull
          pnpm install
          pm2 restart bit-website
```

---

## 💾 Backup Strategy

### Automated Backups

Create a backup script `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/backups/bit"

# Backup questions data
mkdir -p $BACKUP_DIR
cp data/questions.json $BACKUP_DIR/questions_$DATE.json

# Compress
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/questions_$DATE.json

# Remove old backups (keep last 30 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## 🔥 Troubleshooting

### Server won't start
```bash
# Check if port is in use
lsof -i :3000

# Check PM2 logs
pm2 logs bit-website --err
```

### High memory usage
```bash
# Restart application
pm2 restart bit-website

# Monitor memory
pm2 monit
```

### Database issues
```bash
# Verify file permissions
ls -la data/questions.json

# Restore from backup
cp /backups/questions.json data/questions.json
```

---

## 📞 Support

For deployment issues:
- Check server logs
- Review error messages
- Contact DevOps team
- Refer to platform documentation

---

## 🎉 Post-Deployment

After successful deployment:

1. ✅ Test all pages
2. ✅ Verify admin login
3. ✅ Test Q&A submission
4. ✅ Check mobile responsiveness
5. ✅ Test on different browsers
6. ✅ Monitor logs for errors
7. ✅ Set up uptime monitoring (e.g., UptimeRobot)
8. ✅ Configure Google Analytics (optional)

---

**Congratulations! Your BIT Children Ministry website is now live! 🎊**
