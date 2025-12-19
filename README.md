# tritesWebApp
This was developed and tested on XAMPP 8.0.10.
To play the game XAMPP has to be installed, and running, 
and this files have to be copied into the htdocs folder inside XAMPP path, 
which by default on linux is at `/opt/lampp`.
To use the database as well it might be needed to import it as well.
To do that you can either
1) launch the script, 
    this is done using the mysql binary which is included in XAMPP version.
    the command should be something like `/opt/lampp/bin/mysql -u root -p < database.sql`.
    instead of database.sql, write the actual path to database.sql file.
2) import the script, 
    and this is doable from myLocalPhpAdmin page, on which you can access from your
    browser, if you search for localhost
