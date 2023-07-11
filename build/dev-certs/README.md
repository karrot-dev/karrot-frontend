If you want to make local certs for pwa/serviceWorker/push testing in local dev you need:

Install mkcert, see https://github.com/FiloSottile/mkcert

Install the root ca

mkcert -install

Then just run as normal, it should automatically create you the cert and ca.
