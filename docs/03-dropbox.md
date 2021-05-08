## DropBox Integration

As discussed above, the application runs without any server-side logic, so there's no way to store files of any kind.

That's why it integrates with DropBox to upload files (backups & images), it might be a bit slow, but nonetheless it's good to see how all of your patients records and backups securely uploaded to DropBox, automatically.

If you don't already have a Dropbox account, register for a new one [by clicking here](https://db.tt/RKAnTNGELg). Using this link to register will give you (and me) an extra 500MB. It's an affiliate link.

Next, go to your apps console: https://www.dropbox.com/developers/apps, create a new app, and make sure to get its access token.

![Create your app](./docs/dropbox0.png)
![Get access token](./docs/dropbox1.png)

This access token will grant the application access to your Dropbox account, so it can now upload and download files.
Keep in mind that you must be online for any file to be uploaded/downloaded.

Now enter the access token in the settings page and you're ready to go.
