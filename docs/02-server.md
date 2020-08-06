# Server

As mentioned above, Apexo, as an application doesn't really offer a backend server so, unless you have a supported version subscription ([Can be obtained from here](https://apexo.app/#start)) then you're responsible for setting your own server and maintaining it.

The good news it: **it's not that hard**, especially for developers.

## The role of servers?

Browsers are really good at displaying your data and maybe storing them temporarily, but when it comes to your patients data, then it must be securely stored in database software. Using a database, your data can be viewed and synchronized across multiple devices too.

To store your data, apexo uses a database software called [CouchDB](https://couchdb.apache.org/), it's open source and free. And to setup your server, you will not need anything than just a regular installation of CouchDB with minimal configuration.

### Step 1: Deploy your server

The first step in the process of setting up your own server, is buying it. Many cloud services offer affordable services. Personally, I've had success with Vultr high frequency plan, it costs 6\$/month and it runs CouchDB very smoothly.

-   Use this affiliate link to register for vultr: [https://www.vultr.com/?ref=8564891-6G](https://www.vultr.com/?ref=8564891-6G) and you will get \$100 for free as you signup.

-   After signing up deploy a new [high frequency server](https://my.vultr.com/deploy/) with Ubuntu 20.04.

### Step 2: Install CouchDB

Once the server is deployed, up and running, use the commands below to install CouchDB

```
$ sudo apt-get install -y apt-transport-https gnupg ca-certificates
$ echo "deb https://apache.bintray.com/couchdb-deb focal main" \
    | sudo tee -a /etc/apt/sources.list.d/couchdb.list
$ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys \
  8756C4F765C9AC3CB6B85D62379CE192D401AB61
$ sudo apt update
$ sudo apt install -y couchdb
```

Installation of CouchDB will begin and once you're prompted for:

-   Admin credentials: enter a username and a password, those are the credentials you'll be using to login in the apexo application
-   Bind to server: enter `127.0.0.1` you don't need to bind to `0.0.0.0` as in the next step you'll be setting up a domain and a reverse proxy

Once the install is completed, run the following command:

```
$ curl 127.0.0.1:5984
```

and you should get an output like this:

```
{"couchdb":"Welcome","version":"3.1.0","git_sha":"ff0feea20","uuid":"a2e590bd491c430e1560f821da01d0b6","features":["access-ready","partitioned","pluggable-storage-engines","reshard","scheduler"],"vendor":{"name":"The Apache Software Foundation"}}
```

### Step 2: Configure CouchDB

Once CouchDB is installed, run the command below to locate the configuration file:

```
$ couchdb -c
```

You'll be given two paths like this

```
/usr/local/etc/couchdb/default.ini
/usr/local/etc/couchdb/local.ini
```

-   The `default.ini` file would be replaced if you're going to upgrade couchDB in the future
-   You should be editing the `local.ini` file

Run the command

```
$ sudo nano /usr/local/etc/couchdb/local.ini
```

and you'll enter the nano text editor to configure your installation of CouchDB

The configurations you'll enter concerns:

1. Enabling CORS requests
2. Setting `samesite` attribute of the cookie
3. Enabling persistent cookies

So, enter the following configurations in the file:

```
[httpd]
enable_cors = true
[cors]
credentials = true
origins = *
headers = X-Couch-Id, X-Couch-Rev
methods = GET,POST,PUT,DELETE,OPTIONS
max_age = 3600
[couch_httpd_auth]
same_site = none
allow_persistent_cookies = true
```

Restart couchdb to apply the changes in the configuration

```
$ sudo service couchdb restart
```

### Step 4: Buy a domain

Now that your server is ready, you need to buy a domain and direct the nameservers of it to that of Vultr. You can use GoDaddy, Namecheap or whatever satisfies your needs.

### Step 5: Install & configure NGINX

After purchasing your domain, back to your server, you'll need to setup NGINX.

```
$ sudo apt-get update
$ sudo apt-get install nginx
```

And then verify your Nginx installation by running the following command

```
$ sudo nginx -v
```

### Step 6: Configuring Nginx

Now that you have Nginx up and running you need to make it listen to incoming requests and proxy them onto CouchDB.

Create a new site in nginx and start editing using the commands below

```
$ sudo touch /etc/nginx/sites-enabled/couchdb
$ sudo nano /etc/nginx/sites-enabled/couchdb
```

and use the following config

```
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    location / {
        try_files $uri $uri/ =404;
        proxy_pass http://127.0.0.1:5984;
        proxy_redirect off;
        proxy_buffering off;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

replace `example.com` in the configuration above with the domain you bought.

### Step 6: Install SSL Certificates

Now when you visit your domain (e.g. http://example.com), you should be greeted with couchdb, but you're not done yet.

For security, all communications between Apexo application and your server must be encrypted, and the application will not work and it won't send any data unless it is.

So, you will need to install an SSL certificate, and I recommend you use certbot for that.

Install certbot using the commands below:

```
$ sudo apt-get update
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository universe
$ sudo apt-get update
$ sudo apt-get install certbot python3-certbot-nginx
```

And then install the certificate using this command

```
$ sudo certbot --nginx
```

And then test automatic renewal of your certificate using this command

```
$ sudo certbot renew --dry-run
```

And you're done! you should be able to access your server using the HTTPS protocol (https://example.com) and this is the location of your server.

Next, head to [apexo](https://web.apexo.app), use the _community version_ tab, enter your domain in the server location field and enter the admin username and password in the appropriate fields and everything should work as expected!

### Thins to consider

1. **Compliance**: Depending on the governing law where your clinic operates, you might need to make your server compliant, as it will store and handle patients data. (lookup [HIPAA compliance](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html) for example).

2. **Security**: CouchDB is secure, but there are few things you need to consider and lookup depending on the operating system of your server (firewall, SSH, and malware detection for example).

3. **Updating**: CouchDB, like any software, usually releases security patches & updates, look them up and update regularly.

4. **Maintaining**: Every server needs regular maintenance, always consider looking through your log files, monitoring your uptime and checking the overall health of your server.

5. **Performance**: as your data begin to pile, you will need to scale your server accordingly, CouchDB has been designed beautifully for this. (Lookup CouchDB clustering & horizontal scaling).

---

> Note: The supported version doesn't include any of the above (or below) steps, as you'll be using our HIPAA-compliant, secure, highly optimized and regularly maintained servers in addition to 24/7 priority support. You can subscribe to the supported version for only £299 / year.

> Get the supported version using this link: [https://apexo.app/#start](https://apexo.app/#start)

---
