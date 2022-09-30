# Deployment guide

Karrot can be easily deployed with [co-op cloud](https://coopcloud.tech). This approach aims to minimize the amount of configuration that needs to be done, and allow you to quicky and easily deploy and manage your own Karrot instance.

## Prerequsites

- [`abra`](https://docs.coopcloud.tech/abra/install/) installed on your local computer
- A domain name
- An internet-reachable machine running linux, [configured for use with abra](https://docs.coopcloud.tech/operators/tutorial/#deploy-your-first-app)
    - that includes a running [traefik instance](https://docs.coopcloud.tech/operators/tutorial/#web-proxy-setup)

## Steps

1. `abra app new karrot`
    - choose your server
    - choose a domain name that karrot will be deployed under: this is what we refer to as `karrot app name`
2. `abra app config <karrot app name>` see [configuration options](#configuration-options) below
3. `abra app deploy <karrot app name>`
4. Wait for a few minutes while karrot initializes and then you can start creating accounts!

## Configuration options

- `TYPE`, `SITE_URL`, `LETS_ENCRYPT_ENV` - leave as-is
- `DOMAIN` - this is the domain name which resolves to karrot. Should be set to the same as app name
- `MAXMIND_ACCOUNT_ID` and `MAXMIND_LICENSE_KEY` are API credentials from maxmind.com. You need an account there to get GeoIP data for Karrot.
- `SITE_NAME` - what you want your Karrot instance to be called. This will appear i.e. in registration mails.
- `SITE_LOGO` - set to Karrot project logo by default, point it to a .png image reachable via http(s)
- `EMAIL_BACKEND`:
     - if set to `console`, no e-mails will be sent to users, instead they will be logged to `app` service logs and accessible by running `abra app logs <karrot app name> app`. Useful for debugging!
     - if set to `smtp` you have to configure an e-mail server.
- `EMAIL_FROM` - the sender e-mail address
- `SMTP_USER` - login to the SMTP server. Often the same as `EMAIL_FROM`.
- `SMTP_PASSWORD` - password for the SMTP server
- `SMTP_HOST` - domain (or IP address) of the SMTP server
- `SMTP_USE_SSL` - leave commented. If you want to use SSL instead of TLS set `SMTP_USE_TLS` to `false` and this to `true`
- `SMTP_USE_TLS` - set to true to enable encryption 
- `SMTP_PORT` - set to 587 which is default TLS SMTP port. 
