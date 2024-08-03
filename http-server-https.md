
# http-server with security certificate

## Setting up local development self-signed certificates

To use HTTPS with the `http-server` command, you'll need to generate SSL certificates and provide them to the server. Here's a step-by-step guide on how to do this:

1. First, make sure you have `http-server` installed. If not, you can install it using npm:

   ```console
   npm install -g http-server
   ```

2. Generate a self-signed SSL certificate. You can do this using OpenSSL. If you don't have OpenSSL installed, you'll need to install it first. Then, run the following command:

   ```console
   openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
   ```

   This will create two files: `key.pem` (your private key) and `cert.pem` (your certificate).

3. Now you can start `http-server` with HTTPS using these certificates:

   ```console
   http-server -S -C cert.pem -K key.pem
   ```

   Here's what these flags mean:
   - `-S`: Enable HTTPS
   - `-C`: Specify the certificate file
   - `-K`: Specify the key file

4. By default, this will serve on `https://localhost:8080`. You can specify a different port using the `-p` flag:

   ```console
   http-server -S -C cert.pem -K key.pem -p 3000
   ```

## Important considerations

1. Self-signed certificates will cause browsers to show a security warning. This is fine for local development, but not suitable for production use.

2. For production, you should obtain a certificate from a trusted Certificate Authority (CA) like Let's Encrypt.

3. Never share your private key (`key.pem`) with anyone or commit it to version control.

4. The `-S` flag alone will use a built-in key and certificate, but it's generally better to use your own certificates for more control and security.

5. If you're serving to devices other than localhost, you may need to specify the host with `-a`:

   ```console
   http-server -S -C cert.pem -K key.pem -a 0.0.0.0
   ```

Remember, while this method works for development and testing, it's not recommended for production environments. For production, use a proper web server like Nginx or Apache with certificates from a trusted CA.
