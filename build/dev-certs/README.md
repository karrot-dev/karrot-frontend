If you want to make local certs for pwa/serviceWorker/push testing in local dev you need:

Install mkcert, see https://github.com/FiloSottile/mkcert

Install the root ca

   mkcert -install

run this (in this directory) to generate the local certs

    mkcert -cert-file cert.pem -key-file key.pem localhost

copy the root ca into here:

  cp $(mkcert -CAROOT)/rootCA.pem ca.pem

(I'm using docker, so a symlink won't work here, but if you're not you could do that!)

You want to end up with three files:
- cert.pem
- key.pem
- ca.pem
