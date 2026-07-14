# BIT Project Deployment & Cleanup Guide

This guide covers how to clean up the legacy Node.js environment from cPanel and deploy the new PHP/SQLite architecture.

## Part 1: How to Clean Up the Old Project
Since the project recently migrated from a Node.js setup to a PHP architecture, you need to remove the old Node application and its related files so they don't consume resources or cause conflicts.

1. **Stop & Remove the Node.js App**:
   - Log into cPanel and scroll down to the **Software** section.
   - Click on **Setup Node.js App**.
   - Find the old Node.js application in the list and click the **Trash/Delete** icon to stop the server and remove the virtual environment.

2. **Delete the Old Files**:
   - Go back to the cPanel dashboard and open the **File Manager**.
   - The old Node application files were likely stored either in `public_html` or in a separate application folder in your home directory (e.g., `/home/username/node_app/`).
   - Navigate to the folder containing the old project files. Click **Select All**, then **Delete** (check the box to skip the trash and permanently delete them). 
   - *Note: Be careful not to delete essential cPanel folders like `public_ftp`, `.cpanel`, or `mail`.*

3. **Remove Old Databases (If any)**:
   - If the old project used a MySQL database, go to **MySQL Databases** under the Databases section.
   - Delete the old database under "Current Databases" and remove its associated user under "Current Users".

---

## Part 2: Deploying the New PHP Project (BIT)
The new architecture is split into the public-facing files (`public/`) and the private database/JSON files (`data/`). The `config.php` is configured to look for the `data` folder one level above the public root, keeping the database completely secure from web access.

### Step 1: Prepare your files locally
- Go to your local project folder.
- Go **inside** the `public` folder, select all the files (`api`, `components`, `index.html`, etc.), and zip them into a file called `public.zip`. 
- Zip your `data` folder into a separate file called `data.zip`.

### Step 2: Upload the Public Files
- In cPanel **File Manager**, navigate to your web root folder (usually `public_html` for your main domain, or a specific folder if using an addon domain).
- Click **Upload** and select your `public.zip` file.
- Once uploaded, right-click `public.zip` and choose **Extract**. 
- Make sure `index.html`, the `api` folder, and the `.htaccess` file are sitting directly inside `public_html`. You can delete the `public.zip` file afterward.

### Step 3: Upload the Secure Data Folder
- In **File Manager**, go up one level to your home directory (usually `/home/yourusername/`). This is the folder *above* `public_html`.
- Click **Upload** and select your `data.zip` file.
- Extract it so that you now have a folder named `data` sitting directly inside `/home/yourusername/` (parallel to `public_html`).
- *Why here? Because the PHP API is configured to look for the database at `../../data`, resolving perfectly to this secure directory.*

### Step 4: Set File Permissions
To ensure the PHP scripts can read/write to the SQLite database and save user uploads, you need to check a few folder permissions:
- Right-click the `data` folder in your home directory, click **Change Permissions**, and ensure it is set to **755** (or `rwxr-xr-x`).
- Go inside the `data` folder, right-click `database.sqlite` (if it exists), and ensure it is set to **644** (or **664**). 
- Go to `public_html/uploads` and ensure its permissions are set to **755** so the API can save uploaded event/profile images.

Once this is done, your site should be live, highly performant under Apache/cPanel, and your SQLite database perfectly secured!
