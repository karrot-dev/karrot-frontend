# Self-hosting backups

If you are using co-op cloud you can use this guide to configure backups.

<div class="warning">
The backup tool is still under development by the co-op cloud team, so we need to use an unreleased version for now. Once it's released properly this guide can be made simpler.
</div>

## High-level overview

The backup tool is a separate "app" that you deploy into your co-op cloud server. It reads docker the labels that the Karrot recipe has already set, which then triggers it to backup the data volumes, the database, and the secrets.

The data is backed up into a [restic](https://restic.net/) repository, which can be locally on the machine, or in cloud storage.

Restore is currently a manual process.

## This guide

This guide will configure backups to run once a day at 3:30am, and send them the S3-compatible [Backblaze B2 storage](https://www.backblaze.com/cloud-storage).

Prerequisites:
- an existing co-op cloud server
- abra set up on your local machine
- knowledge of basic git commands
- optional but recommended - a Backblaze B2 account (tip, make sure to select a region when signing up, e.g. "EU Central")
- a cup of tea ☕

### 1. Get unreleased backup-bot-two recipe

We need the latest unreleased version for now, so let's get that checked out:

```bash
cd ~/.abra/recipes/backup-bot-two/
git switch main
```

### 2. Prepare Backblaze B2 account

Create a Backblaze B2 account at https://www.backblaze.com/sign-up/cloud-storage
Make sure to select the region you want, e.g. "EU Central"

Then create a bucket to store the backups. You don't need to use the encryption or versioning as the backup will be encrypted and versioned by restic already.

Create an application key that has "Read and Write" access to the bucket. Probably select the "Allow List All Bucket Names" option (not sure though).

You'll need to use two of the key values for the next step:

| Backblaze B2 | backup-bot-two |
|--|--|
| `keyID` | `AWS_ACCESS_KEY_ID` config |
| `applicationKey` | `aws_secret_access_key` secret` |


### 3. Setup backup-bot-two app

```bash
abra app new backup-bot-two
```

Then configure it using whatever domain name you gave it (it won't actually serve anything at that domain, it's basically a _name_ for it):

```bash
abra app config <domain>
```

You can find the endpoint in the details for your bucket and then make the S3 URL like this:
```
https://<endpoint>/<bucket-name>
```

e.g. `https://s3.eu-central-003.backblazeb2.com/example-bucket-name`

Then use this to configure the restic repo + include the S3 compose file:

```bash
RESTIC_REPOSITORY=s3:https://s3.eu-central-003.backblazeb2.com/example-bucket-name

SECRET_AWS_SECRET_ACCESS_KEY_VERSION=v1
AWS_ACCESS_KEY_ID=003d51cd48b6cf40000000009
COMPOSE_FILE="$COMPOSE_FILE:compose.s3.yml"
```

Then insert the secret key:

```bash
abra app secret insert <domain> aws_secret_access_key v1 <applicationKey>
```

... and generate the restic password:

```bash
abra app secret generate <domain> restic_password v1
```

<div class="warning">

Make sure to save the restic password somewhere safe, without it you will be unable to access the backup!

</div>

### 4. Deploy it!

You'll need to use `--chaos` to deploy the checked out version. It's a good idea to check back in `~/.abra/recipes/backup-bot-two/` to see if you are still on `main` branch, as running some of the commands will switch you to the released version.

```bash
abra app deploy <domain> --chaos
```

### 5. Manually run it to check if it's working ok

```bash
abra app run <domain> app -- backup create
```

If successful, it should show `backup finished`.

### 6. Mount your restic repository locally to check it's working

If you install [restic](https://restic.net/) on your local machine you can mount the backups and verify it's actually got the data you are expecting it to have.

```bash
mkdir /tmp/backup

B2_ACCOUNT_ID=<keyId> B2_ACCOUNT_KEY=<applicationKey> restic -r b2:<bucket-name>: mount /tmp/backup
```

It'll ask you for your restic password, then you should be able to browse the latest snapshot at `/tmp/backup/snapshots/latest/`.

For convenience, I store the B2 credentials in my local [pass](https://www.passwordstore.org/) store and use the following restic wrapper script (saved as executable file `restic-karrot-selfhost` somewhere on my `PATH`):

```bash
#!/bin/bash

B2_ACCOUNT_ID=$(pass karrot-selfhost/b2key) \
B2_ACCOUNT_KEY=$(pass karrot-selfhost/b2secret) \
restic \
  -r b2:karrot-selfhost: \
  --verbose \
  --password-command="pass karrot-selfhost/resticpassword" \
  "$@"
```

Which I can then run restic commands such as:

```bash
restic-karrot-selfhost snapshots
```

### 7. Restoring

As mentioned initially, there is not currently a restore feature implemented in backup-bot-two (coming soon!), but you can manually restore if you need to by mounting the backup, and copying any relevant files/secrets out. The rest is left as an exercise to the reader.
