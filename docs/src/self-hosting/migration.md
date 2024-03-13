# Migrating group data

Karrot has the facility to export group data from one instance and import it on another instance. It is intended as a migration tool for migrating whole groups to new instances.

Important info:
- it is a one-time export/import, if you try and re-import it will error because the group name is taken (you could rename or remove the group manually though and a re-import should work again)
- the database ids are not preserved, this is so you can import the group into an instance which has already used those ids
- if a user already exists on the destination, that existing user will be used and their account data not imported
- the export gives you an encrypted file which you have to copy yourself to the machine the other instance is running on, you should copy the encryption password separately to avoid others gaining access to the data

It currently does **NOT** migrate:
- messages
- history
- issues
- applications

(see https://github.com/karrot-dev/karrot-backend/blob/master/karrot/migrate/exporter.py `excluded_models` variable for the full list).

If you want an export that includes those other content types please contact us as we will likely add functionality for that.

## Guide

### 1. Connect to the existing instance and run the export command

(Or ask the existing instance admin to create you an export).

```bash
./karrot-backend.pyz --env .env manage export --groups <ids>
```

It'll give you a file such as `export.tar.xz.gpg` and print out the encryption password, keep this handy for the import.

(you can optionally specify a file path to export to, just be sure it ends with `.tar.xz.gpg`)

### 2. Transfer the file to the other instance

If using co-op cloud you can use this command to copy a local file over:

```bash
abra app cp <domain> <filename> app:/
```

### 3. Run the import

```bash
abra app run <domain> app python karrot-backend.pyz manage import /<filename>
```

It'll ask you for the password. If successful it'll print `Import complete` at the end.
